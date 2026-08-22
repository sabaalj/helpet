"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import AuthLayout, {
  AuthAside,
  AuthPanel,
  SocialButtons,
} from "@/components/forms/AuthLayout";
import { Field } from "@/components/ui/fields";
import { auth } from "@/lib/firebase";

const AVATARS = [
  "/assets/hero-avatar-1.png",
  "/assets/hero-avatar-2.png",
  "/assets/avatar-user.png",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Shown when the credentials were correct but the email isn't verified.
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendState, setResendState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [resendError, setResendError] = useState("");

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    if (googleLoading || loading) return;

    setError("");
    setNeedsVerification(false);
    setGoogleLoading(true);

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = credential.user;

      // Google verifies the address itself, so these accounts skip the
      // email-verification gate entirely.
      const profileRef = doc(db, "users", user.uid);

      try {
        const snapshot = await getDoc(profileRef);

        // First Google sign-in: seed a profile from what Google gives us.
        // Phone and city stay empty — the user fills them from Edit.
        if (!snapshot.exists()) {
          await setDoc(profileRef, {
            fullName: user.displayName || "",
            email: user.email || "",
            phone: "",
            city: "",
            createdAt: serverTimestamp(),
          });
        }
      } catch (dbError) {
        // Don't block the login over a profile write — the account page
        // shows a "not saved yet" notice and offers Edit.
        console.error("Failed to seed Google profile:", dbError);
      }

      router.push("/account");
    } catch (err: unknown) {
      console.error(err);
      setGoogleLoading(false);

      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code?: string }).code)
          : "";

      switch (code) {
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
          // The user backed out on purpose — no error worth showing.
          break;
        case "auth/popup-blocked":
          setError("Your browser blocked the popup. Allow popups and retry.");
          break;
        case "auth/account-exists-with-different-credential":
          setError(
            "This email is already registered with a password. Log in with your password instead."
          );
          break;
        case "auth/operation-not-allowed":
          setError("Google sign-in isn't enabled for this project yet.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Check your connection and try again.");
          break;
        default:
          setError("Couldn't sign in with Google. Please try again.");
      }
    }
  };

  const handleResend = async () => {
    if (resendState === "sending" || loading) return;

    setResendState("sending");
    setResendError("");

    try {
      // The session was dropped after the failed check, so sign in briefly
      // to get a User object, send the link, then sign out again.
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Block duplicate submissions while a sign-in is already in flight.
    if (loading) return;

    setError("");
    setNeedsVerification(false);
    setResendState("idle");

    const mail = email.trim();

    if (!mail || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    if (!EMAIL_PATTERN.test(mail)) {
      setError("Enter a valid email address, like you@example.com.");
      return;
    }

    setLoading(true);

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const userCredential = await signInWithEmailAndPassword(
        auth,
        mail,
        password
      );

      // Pick up a verification that happened in another tab or on another
      // device — emailVerified is cached in the token otherwise.
      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        // Unverified accounts don't get a session at all.
        await signOut(auth);

        setLoading(false);
        setNeedsVerification(true);
        setError(
          "Verify your email before logging in. Check your inbox for the link we sent."
        );
        return;
      }

      router.push("/account");
    } catch (err: unknown) {
      console.error(err);
      setLoading(false);

      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code?: string }).code)
          : "";

      switch (code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Incorrect email or password.");
          break;
        case "auth/invalid-email":
          setError("Enter a valid email address, like you@example.com.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled. Contact support for help.");
          break;
        case "auth/too-many-requests":
          setError(
            "Too many failed attempts. Wait a moment before trying again."
          );
          break;
        case "auth/network-request-failed":
          setError("Network error. Check your connection and try again.");
          break;
        case "auth/operation-not-allowed":
          setError("Email login is unavailable right now. Try again later.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <AuthPanel
        eyebrow="Welcome to"
        title="Helpet"
        intro="Everything your pet needs — sign in to manage your reports, listings and pets."
      >
        <form
          className="flex flex-col gap-[28px]"
          onSubmit={handleLogin}
          noValidate
        >
          <Field
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={setEmail}
          />

          <Field
            label="Password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={setPassword}
          />

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-[8px] text-small-14 text-neutral-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="size-[16px] accent-purple-3"
              />
              Remember me
            </label>

            <Link
              href="/login"
              className="text-small-14 font-semibold text-purple-3 underline"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <p
              role="alert"
              aria-live="polite"
              className="text-center text-sm text-red-600"
            >
              {error}
            </p>
          )}

          {needsVerification && (
            <div className="flex flex-col items-center gap-[8px]">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendState === "sending" || loading}
                className="text-small-14 font-bold text-purple-3 underline disabled:opacity-60"
              >
                {resendState === "sending"
                  ? "Sending..."
                  : "Resend verification email"}
              </button>

              {resendState === "sent" && (
                <p className="text-small-14 text-green-3">
                  Sent. Open the link, then log in again.
                </p>
              )}

              {resendState === "error" && (
                <p role="alert" className="text-center text-sm text-red-600">
                  {resendError}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            aria-busy={loading}
            className="btn-primary h-[52px] w-full disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-content-18 text-neutral-700">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-purple-3 underline"
            >
              Create Account
            </Link>
          </p>

          <SocialButtons
            verb="Sign In"
            onGoogle={handleGoogle}
            loading={googleLoading}
          />
        </form>
      </AuthPanel>

      <AuthAside
        variant="teal"
        headline="Healthy pets bring joy and enrich your life."
        photo="/assets/company-dog.png"
        photoAlt="Happy dog"
        card={{
          title: "Join Our Online Pet Care & Protection Community",
          body: "Join our online animal protection community today and share your knowledge and experience to help care for and protect pets everywhere!",
          footer: (
            <div className="flex items-center justify-between gap-[15px]">
              <div className="flex items-center gap-[10px]">
                <div className="flex -space-x-[10px]">
                  {[0, 1, 2].map((i) => (
                    <img
                      key={i}
                      src={AVATARS[i]}
                      alt=""
                      className="size-[36px] rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>

                <div className="text-desc-12 leading-[14px] text-white">
                  <p className="font-bold">JOIN WITH 100K+</p>
                  <p className="font-bold">
                    PEOPLE AROUND THE WORLD!
                  </p>
                  <p className="text-white/80">
                    Let&apos;s meet some new friends
                  </p>
                </div>
              </div>

              <Link
                href="/signup"
                className="btn-primary h-[40px] shrink-0 px-[20px] text-small-14"
              >
                Join Now
              </Link>
            </div>
          ),
        }}
      />
    </AuthLayout>
  );
}
