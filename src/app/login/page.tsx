"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout, {
  AuthAside,
  AuthPanel,
  SocialButtons,
} from "@/components/forms/AuthLayout";
import { Field } from "@/components/ui/fields";

const AVATARS = ["/assets/hero-avatar-1.png", "/assets/hero-avatar-2.png", "/assets/avatar-user.png"];

export default function LoginPage() {
  const router = useRouter();

  return (
    <AuthLayout>
      <AuthPanel
        eyebrow="Welcome to"
        title="Helpet"
        intro="Everything your pet needs — sign in to manage your reports, listings and pets."
      >
        <form
          className="flex flex-col gap-[28px]"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/account");
          }}
        >
          <Field label="Email" type="email" placeholder="you@example.com" required />
          <Field label="Password" type="password" placeholder="Password" required />

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-[8px] text-small-14 text-neutral-700">
              <input
                type="checkbox"
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

          <button type="submit" className="btn-primary h-[52px] w-full">
            Login
          </button>

          <p className="text-center text-content-18 text-neutral-700">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-purple-3 underline">
              Create Account
            </Link>
          </p>

          <SocialButtons verb="Sign In" />
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
                    // eslint-disable-next-line @next/next/no-img-element
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
                  <p className="font-bold">PEOPLE AROUND THE WORLD!</p>
                  <p className="text-white/80">Let&apos;s meet some new friends</p>
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
