"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  linkWithPhoneNumber,
  RecaptchaVerifier,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type ConfirmationResult,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import AuthLayout, {
  AuthAside,
  AuthPanel,
  SocialButtons,
} from "@/components/forms/AuthLayout";
import { Field } from "@/components/ui/fields";
import { auth } from "@/lib/firebase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Firebase needs E.164 ("+9665XXXXXXXX"). Accepts the common Saudi shapes:
 * 0512345678, 512345678, 00966512345678, +966 51 234 5678.
 * Returns "" when it can't produce something valid.
 */
function toE164(input: string) {
  const raw = input.trim();
  let digits = raw.replace(/\D/g, "");

  if (raw.startsWith("+")) {
    return digits.length >= 8 ? `+${digits}` : "";
  }

  if (digits.startsWith("00")) digits = digits.slice(2);

  // Local Saudi formats -> add the country code.
  if (digits.startsWith("0")) digits = `966${digits.slice(1)}`;
  else if (digits.length === 9 && digits.startsWith("5")) digits = `966${digits}`;

  return digits.length >= 10 ? `+${digits}` : "";
}

const PET_TYPES = ["Cat", "Dog", "Bird", "Rabbit", "Other"] as const;
const PET_GENDERS = ["Male", "Female", "Unknown"] as const;

type PetDraft = {
  id: number;
  name: string;
  type: string;
  age: string;
  gender: string;
};

const emptyPet = (id: number): PetDraft => ({
  id,
  name: "",
  type: "",
  age: "",
  gender: "",
});

/** Local select styled to match the existing form inputs. */
function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-[8px]">
      <span className="text-small-14 font-semibold text-neutral-800">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-[52px] w-full rounded-btn border border-neutral-300 bg-white px-[16px] text-content-18 text-neutral-800 outline-none transition-colors focus:border-purple-3 disabled:opacity-60"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [hasPets, setHasPets] = useState<"yes" | "no">("no");
  const [pets, setPets] = useState<PetDraft[]>([emptyPet(1)]);
  const nextPetId = useRef(2);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Which screen we're on: the form, the OTP step, or the final message.
  const [step, setStep] = useState<"form" | "otp" | "done">("form");

  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendState, setResendState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [resendError, setResendError] = useState("");

  // Phone / OTP step.
  const [otpCode, setOtpCode] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpResending, setOtpResending] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  // reCAPTCHA is mandatory for phone auth. Invisible, but it must exist in
  // the DOM before linkWithPhoneNumber is called.
  const getRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }

    return recaptchaRef.current;
  };

  useEffect(() => {
    return () => {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    };
  }, []);

  const describeOtpError = (err: unknown) => {
    const code =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code?: string }).code)
        : "";

    switch (code) {
      case "auth/invalid-verification-code":
        return "That code isn't right. Check it and try again.";
      case "auth/code-expired":
        return "The code expired. Request a new one.";
      case "auth/invalid-phone-number":
        return "That phone number isn't valid. Include the country code.";
      case "auth/too-many-requests":
        return "Too many attempts. Wait a few minutes and try again.";
      case "auth/credential-already-in-use":
      case "auth/account-exists-with-different-credential":
        return "This number is already linked to another account.";
      case "auth/operation-not-allowed":
        return "Phone sign-in isn't enabled for this project yet.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return "Couldn't verify the code. Please try again.";
    }
  };

  /** Sends (or resends) the SMS code to the current user's phone. */
  const sendOtp = async (e164: string) => {
    const user = auth.currentUser;

    if (!user) {
      setOtpError("Your session ended. Log in to finish verifying your number.");
      return false;
    }

    try {
      confirmationRef.current = await linkWithPhoneNumber(
        user,
        e164,
        getRecaptcha()
      );

      return true;
    } catch (err) {
      console.error("Failed to send OTP:", err);

      // A failed attempt burns the verifier — rebuild it next time.
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;

      setOtpError(describeOtpError(err));
      return false;
    }
  };

  const handleVerifyOtp = async () => {
    if (otpVerifying) return;

    const code = otpCode.trim();

    if (code.length < 6) {
      setOtpError("Enter the 6-digit code we sent you.");
      return;
    }

    if (!confirmationRef.current) {
      setOtpError("Request a new code to continue.");
      return;
    }

    setOtpVerifying(true);
    setOtpError("");

    try {
      // Links the phone number to the account created a moment ago, so it
      // stays one user with two providers.
      const credential = await confirmationRef.current.confirm(code);
      const uid = credential.user.uid;

      try {
        await setDoc(
          doc(db, "users", uid),
          { phone: otpPhone, phoneVerified: true },
          { merge: true }
        );
      } catch (dbError) {
        console.error("Failed to flag phone as verified:", dbError);
      }

      try {
        await sendEmailVerification(credential.user);
      } catch (mailError) {
        console.error("Failed to send verification email:", mailError);
      }

      try {
        await signOut(auth);
      } catch (signOutError) {
        console.error("Failed to sign out after signup:", signOutError);
      }

      setOtpVerifying(false);
      setStep("done");
    } catch (err) {
      console.error(err);
      setOtpVerifying(false);
      setOtpError(describeOtpError(err));
    }
  };

  const handleResendOtp = async () => {
    if (otpResending) return;

    setOtpResending(true);
    setOtpError("");
    setOtpCode("");

    const sent = await sendOtp(otpPhone);

    setOtpResending(false);

    if (sent) setOtpError("");
  };

  const updatePet = (id: number, key: keyof Omit<PetDraft, "id">, value: string) => {
    setPets((current) =>
      current.map((pet) => (pet.id === id ? { ...pet, [key]: value } : pet))
    );
  };

  const addPet = () => {
    setPets((current) => [...current, emptyPet(nextPetId.current++)]);
  };

  const removePet = (id: number) => {
    setPets((current) =>
      current.length > 1 ? current.filter((pet) => pet.id !== id) : current
    );
  };

  const handleHasPetsChange = (value: "yes" | "no") => {
    setHasPets(value);
    setError("");

    // Make sure there's always one blank row waiting when they switch to Yes.
    if (value === "yes" && pets.length === 0) {
      setPets([emptyPet(nextPetId.current++)]);
    }
  };

  const handleResend = async () => {
    if (resendState === "sending") return;

    setResendState("sending");
    setResendError("");

    try {
      // There's no live session now, so sign in briefly to get a User
      // object, send the link, then sign out again.
      const credential = await signInWithEmailAndPassword(
        auth,
        verificationEmail,
        password
      );

      await sendEmailVerification(credential.user);
      await signOut(auth);

      setResendState("sent");
    } catch (err: unknown) {
      console.error(err);

      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code?: string }).code)
          : "";

      setResendState("error");
      setResendError(
        code === "auth/too-many-requests"
          ? "Too many requests. Wait a few minutes before asking for another email."
          : "Couldn't send the email. Please try again."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Block duplicate submissions while a signup is already in flight.
    if (loading) return;

    setError("");

    const name = fullName.trim();
    const mail = email.trim();
    const tel = phone.trim();
    const town = city.trim();

    if (!name || !mail || !tel || !town || !password || !confirmPassword) {
      setError("Fill in all fields to continue.");
      return;
    }

    if (name.length < 2) {
      setError("Enter your full name.");
      return;
    }

    if (!EMAIL_PATTERN.test(mail)) {
      setError("Enter a valid email address, like you@example.com.");
      return;
    }

    // Firebase phone auth only accepts E.164, so normalise up front.
    const e164 = toE164(tel);

    if (!e164) {
      setError(
        "Enter a valid phone number with country code, like +966512345678."
      );
      return;
    }

    if (town.length < 2) {
      setError("Enter the city you live in.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Pet details are only required when the user says they have pets.
    const petsToSave =
      hasPets === "yes"
        ? pets.map((pet) => ({
            name: pet.name.trim(),
            type: pet.type,
            age: pet.age.trim(),
            gender: pet.gender,
          }))
        : [];

    if (hasPets === "yes") {
      if (petsToSave.length === 0) {
        setError("Add your pet's details, or choose No above.");
        return;
      }

      for (let i = 0; i < petsToSave.length; i++) {
        const pet = petsToSave[i];
        const position = `Pet ${i + 1}`;

        if (!pet.name) {
          setError(`${position}: enter a name.`);
          return;
        }

        if (!pet.type) {
          setError(`${position}: choose a type.`);
          return;
        }

        if (!pet.age) {
          setError(`${position}: enter an age.`);
          return;
        }

        if (!pet.gender) {
          setError(`${position}: choose a gender.`);
          return;
        }
      }
    }

    if (!acceptedTerms) {
      setError(
        "Accept the Terms & Conditions and Privacy Policy to create your account."
      );
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        mail,
        password
      );

      const uid = userCredential.user.uid;

      try {
        await setDoc(doc(db, "users", uid), {
          fullName: name,
          email: mail,
          phone: e164,
          city: town,
          phoneVerified: false,
          createdAt: serverTimestamp(),
        });

        // Each pet becomes its own document under users/{uid}/pets/{petId},
        // with Firestore generating the id.
        if (petsToSave.length > 0) {
          const petsRef = collection(db, "users", uid, "pets");

          await Promise.all(
            petsToSave.map((pet) =>
              addDoc(petsRef, {
                name: pet.name,
                type: pet.type,
                age: pet.age,
                gender: pet.gender,
              })
            )
          );
        }
      } catch (dbError) {
        // The account exists, so keep going and log the write failure
        // instead of blocking the user on the form.
        console.error("Failed to save user profile or pets:", dbError);
      }

      // Keep the session alive on purpose: linkWithPhoneNumber needs the
      // signed-in user. The email link and sign-out happen once the code
      // is confirmed.
      setVerificationEmail(mail);
      setOtpPhone(e164);
      setOtpCode("");
      setOtpError("");
      setStep("otp");
      setLoading(false);

      const sent = await sendOtp(e164);

      if (!sent) {
        // sendOtp already set a message; the OTP screen offers a retry.
        console.error("Initial OTP send failed for", e164);
      }
    } catch (err: unknown) {
      console.error(err);
      setLoading(false);

      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code?: string }).code)
          : "";

      switch (code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Try logging in instead.");
          break;
        case "auth/invalid-email":
          setError("Enter a valid email address, like you@example.com.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Use at least 6 characters.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Check your connection and try again.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Wait a moment and try again.");
          break;
        case "auth/operation-not-allowed":
          setError("Email signup is unavailable right now. Try again later.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    }
  };

  const aside = (
    <AuthAside
      variant="green"
      headline="Become a member today and help protect animals!"
      photo="/assets/offer-dogs.png"
      photoAlt="Group of happy pets"
      card={{
        title: "Member Benefits: Faster Reports, Wider Reach",
        body: "Publish unlimited lost & found reports, adoption listings and breeding requests. Track everything from one dashboard and get contacted directly — no middlemen.",
      }}
    />
  );

  // Step 2: the account exists, now the phone number must be confirmed
  // before anything else happens.
  if (step === "otp") {
    return (
      <AuthLayout>
        <AuthPanel
          eyebrow="One more step"
          title="Verify your phone"
          intro="We sent a 6-digit code by SMS. Enter it to finish creating your account."
        >
          <div className="flex flex-col gap-[28px]">
            <p className="rounded-card bg-purple-5/60 px-[20px] py-[15px] text-content-18 text-neutral-800">
              Code sent to <span className="font-bold">{otpPhone}</span>.
            </p>

            <label className="flex flex-col gap-[8px]">
              <span className="text-small-14 font-semibold text-neutral-800">
                Verification Code
              </span>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                disabled={otpVerifying}
                className="h-[52px] w-full rounded-btn border border-neutral-300 bg-white px-[16px] text-center text-title-20 tracking-[8px] text-neutral-800 outline-none transition-colors focus:border-purple-3 disabled:opacity-60"
              />
            </label>

            {otpError && (
              <p
                role="alert"
                aria-live="polite"
                className="text-center text-sm text-red-600"
              >
                {otpError}
              </p>
            )}

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otpVerifying || otpCode.length < 6}
              aria-busy={otpVerifying}
              className="btn-primary h-[52px] w-full disabled:opacity-60"
            >
              {otpVerifying ? "Verifying..." : "Verify & Finish"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={otpResending || otpVerifying}
              className="text-center text-content-18 font-bold text-purple-3 underline disabled:opacity-60"
            >
              {otpResending ? "Sending..." : "Resend code"}
            </button>

            <p className="text-center text-small-14 text-neutral-600">
              Wrong number? Finish here, then update it from your account.
            </p>
          </div>
        </AuthPanel>

        {aside}
      </AuthLayout>
    );
  }

  // Step 3: everything is done — phone linked, email link sent.
  if (step === "done") {
    return (
      <AuthLayout>
        <AuthPanel
          eyebrow="Almost there"
          title="Verify your email"
          intro="Your phone is confirmed. One last step: confirm your email address."
        >
          <div className="flex flex-col gap-[28px]">
            <p className="rounded-card bg-purple-5/60 px-[20px] py-[15px] text-content-18 text-neutral-800">
              We sent a link to{" "}
              <span className="font-bold">{verificationEmail}</span>. Open it,
              then come back and log in. Check your spam folder if it
              hasn&apos;t arrived after a minute.
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="btn-primary h-[52px] w-full"
            >
              Go to login
            </button>

            <div className="flex flex-col items-center gap-[8px]">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendState === "sending"}
                className="text-content-18 font-bold text-purple-3 underline disabled:opacity-60"
              >
                {resendState === "sending"
                  ? "Sending..."
                  : "Resend verification email"}
              </button>

              {resendState === "sent" && (
                <p className="text-small-14 text-green-3">
                  Sent. Check your inbox.
                </p>
              )}

              {resendState === "error" && (
                <p role="alert" className="text-center text-sm text-red-600">
                  {resendError}
                </p>
              )}
            </div>
          </div>
        </AuthPanel>

        {aside}
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthPanel
        eyebrow="Register"
        title="on Helpet"
        intro="Create your free account to report lost pets, publish adoption listings and connect with pet lovers in your city."
      >
        <form
          className="flex flex-col gap-[28px]"
          onSubmit={handleSubmit}
          noValidate
        >
          <Field
            label="Full Name"
            placeholder="Your full name"
            required
            value={fullName}
            onChange={setFullName}
          />

          <Field
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={setEmail}
          />

          <Field
            label="Phone"
            type="tel"
            placeholder="+966 5X XXX XXXX"
            required
            value={phone}
            onChange={setPhone}
          />

          <Field
            label="City"
            placeholder="Riyadh"
            required
            value={city}
            onChange={setCity}
          />

          <Field
            label="Password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={setPassword}
          />

          <Field
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            required
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          {/* My Pets */}
          <div className="flex flex-col gap-[20px] rounded-card border border-purple-4/50 p-[20px]">
            <div>
              <h2 className="text-title-20 font-bold text-purple-2">My Pets</h2>

              <p className="mt-[4px] text-small-14 text-neutral-600">
                Add them now or later from your account.
              </p>
            </div>

            <fieldset className="flex flex-col gap-[12px]">
              <legend className="text-content-18 font-semibold text-neutral-800">
                Do you have a pet?
              </legend>

              <div className="flex gap-[24px]">
                {(
                  [
                    ["yes", "Yes"],
                    ["no", "No"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-[8px] text-content-18 text-neutral-700"
                  >
                    <input
                      type="radio"
                      name="has-pets"
                      value={value}
                      checked={hasPets === value}
                      onChange={() => handleHasPetsChange(value)}
                      disabled={loading}
                      className="size-[16px] accent-purple-1"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            {hasPets === "yes" && (
              <div className="flex flex-col gap-[20px]">
                {pets.map((pet, index) => (
                  <div
                    key={pet.id}
                    className="flex flex-col gap-[20px] rounded-card bg-purple-5/40 p-[15px]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-content-18 font-bold text-neutral-800">
                        Pet {index + 1}
                      </p>

                      {pets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePet(pet.id)}
                          disabled={loading}
                          className="text-small-14 font-semibold text-red-600 underline disabled:opacity-60"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <Field
                      label="Pet Name"
                      placeholder="Luna"
                      value={pet.name}
                      onChange={(value: string) =>
                        updatePet(pet.id, "name", value)
                      }
                    />

                    <SelectField
                      label="Pet Type"
                      value={pet.type}
                      onChange={(value) => updatePet(pet.id, "type", value)}
                      options={PET_TYPES}
                      placeholder="Select a type"
                      disabled={loading}
                    />

                    <Field
                      label="Pet Age"
                      placeholder="2 years"
                      value={pet.age}
                      onChange={(value: string) =>
                        updatePet(pet.id, "age", value)
                      }
                    />

                    <SelectField
                      label="Pet Gender"
                      value={pet.gender}
                      onChange={(value) => updatePet(pet.id, "gender", value)}
                      options={PET_GENDERS}
                      placeholder="Select a gender"
                      disabled={loading}
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPet}
                  disabled={loading}
                  className="self-start rounded-btn border border-purple-4 px-[15px] py-[8px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5 disabled:opacity-60"
                >
                  + Add Another Pet
                </button>
              </div>
            )}
          </div>

          <label className="flex cursor-pointer items-start gap-[10px] text-content-18 text-neutral-700">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                if (e.target.checked) setError("");
              }}
              disabled={loading}
              aria-describedby="terms-text"
              className="mt-[4px] size-[18px] shrink-0 cursor-pointer accent-purple-1"
            />
            <span id="terms-text">
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-bold text-purple-3 underline"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-bold text-purple-3 underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && (
            <p
              role="alert"
              aria-live="polite"
              className="text-center text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-center gap-[8px]">
            <span className="size-[10px] rounded-full bg-purple-1" />
            <span className="size-[10px] rounded-full border border-neutral-300 bg-white" />
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="btn-primary h-[52px] w-full disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Submit"}
          </button>

          <p className="text-center text-content-18 text-neutral-700">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-purple-3 underline"
            >
              Login Here
            </Link>
          </p>

          <SocialButtons verb="Sign Up" />

          {/* Required by Firebase phone auth. Invisible, but it must be in
              the DOM before the OTP is requested. */}
          <div id="recaptcha-container" />
        </form>
      </AuthPanel>

      {aside}
    </AuthLayout>
  );
}
