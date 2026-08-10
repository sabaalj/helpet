"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout, {
  AuthAside,
  AuthPanel,
  SocialButtons,
} from "@/components/forms/AuthLayout";
import { Field } from "@/components/ui/fields";

export default function SignUpPage() {
  const router = useRouter();

  return (
    <AuthLayout>
      <AuthPanel
        eyebrow="Register"
        title="on Helpet"
        intro="Create your free account to report lost pets, publish adoption listings and connect with pet lovers in your city."
      >
        <form
          className="flex flex-col gap-[28px]"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/account");
          }}
        >
          <Field label="Full Name" placeholder="Your full name" required />
          <Field label="Email" type="email" placeholder="you@example.com" required />
          <Field label="Phone" type="tel" placeholder="+966 5X XXX XXXX" required />
          <Field label="Password" type="password" placeholder="Password" required />
          <Field
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            required
          />

          <div className="flex items-center justify-center gap-[8px]">
            <span className="size-[10px] rounded-full bg-purple-1" />
            <span className="size-[10px] rounded-full border border-neutral-300 bg-white" />
          </div>

          <button type="submit" className="btn-primary h-[52px] w-full">
            Submit
          </button>

          <p className="text-center text-content-18 text-neutral-700">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-purple-3 underline">
              Login Here
            </Link>
          </p>

          <SocialButtons verb="Sign Up" />
        </form>
      </AuthPanel>

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
    </AuthLayout>
  );
}
