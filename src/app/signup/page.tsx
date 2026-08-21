"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
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
 * Normalises common Saudi formats to E.164 ("+9665XXXXXXXX") so numbers are
 * stored consistently. Returns "" when it can't, and the raw input is kept
 * instead — this is only tidying, not a gate.
 */
function toE164(input: string) {
  const raw = input.trim();
  let digits = raw.replace(/\D/g, "");

  if (raw.startsWith("+")) {
    return digits.length >= 8 ? `+${digits}` : "";
  }

  if (digits.startsWith("00")) digits = digits.slice(2);

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

  // Post-signup confirmation screen.
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendState, setResendState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [resendError, setResendError] = useState("");

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

    if (tel.replace(/\D/g, "").length < 8) {
      setError("Enter a valid phone number, including the country code.");
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
          phone: toE164(tel) || tel,
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

      try {
        await sendEmailVerification(userCredential.user);
      } catch (mailError) {
        // A failed verification email shouldn't undo a created account —
        // the confirmation screen offers a resend button.
        console.error("Failed to send verification email:", mailError);
      }

      // createUserWithEmailAndPassword signs the new user in automatically.
      // Drop that session — the account isn't verified yet, so it shouldn't
      // hold a live session either.
      try {
        await signOut(auth);
      } catch (signOutError) {
        console.error("Failed to sign out after signup:", signOutError);
      }

      setVerificationEmail(mail);
      setVerificationSent(true);
      setLoading(false);
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

  // Shown after the account is created and the verification email is sent.
  if (verificationSent) {
    return (
      <AuthLayout>
        <AuthPanel
          eyebrow="Almost there"
          title="Verify your email"
          intro="Your account is ready. Confirm your email address to activate it."
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
        </form>
      </AuthPanel>

      {aside}
    </AuthLayout>
  );
}
