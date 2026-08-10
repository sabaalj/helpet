import Link from "next/link";
import {
  Envelope,
  Phone,
  InstagramLogo,
  FacebookLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr";

/**
 * Footer — faithful to Figma node 613:2175 (Footer component):
 * wave-top lavender background, logo circle badge, description,
 * two contact columns, social icons, tilted polaroid photo and
 * two link columns, with the big rotated paw ornaments.
 */

const SERVICE_LINKS = [
  { label: "Lost & Found", href: "/lost-found" },
  { label: "Adoption", href: "/adoption" },
  { label: "Breeding Requests", href: "/breeding" },
];

const WEBSITE_LINKS = [
  { label: "Home", href: "/" },
  { label: "My Account", href: "/account" },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

export default function Footer() {
  return (
    <footer className="relative mt-[60px] overflow-hidden">
      {/* Wave background — original Figma vector */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/footer-wave.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover object-top"
      />

      {/* Rotated paw ornaments (Figma nodes 609:1881 / 609:1882) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/paw-decor-big.svg"
        alt=""
        aria-hidden
        className="absolute -right-[140px] top-[65px] w-[384px] -rotate-45 opacity-70"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/paw-decor-small.svg"
        alt=""
        aria-hidden
        className="absolute -left-[20px] bottom-[10px] w-[136px] rotate-45 opacity-70"
      />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-[40px] px-[24px] pb-[50px] pt-[100px] lg:flex-row lg:items-center xl:px-[120px]">
        {/* Left column — logo, blurb, contacts, socials */}
        <div className="flex w-full max-w-[387px] flex-col gap-[20px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-circle.svg"
            alt="Helpet"
            className="size-[100px]"
          />
          <p className="text-content-18 text-neutral-800">
            Welcome to Helpet! Everything your pet needs — report lost pets,
            adopt a new friend and find responsible breeding matches.
          </p>

          <div className="flex w-full gap-[20px]">
            <div className="flex flex-1 flex-col gap-[10px]">
              <a
                href="mailto:hello@helpet.app"
                className="flex items-center gap-[10px] text-content-18 text-neutral-800 underline"
              >
                <Envelope size={24} className="shrink-0 text-purple-3" />
                <span className="truncate">hello@helpet.app</span>
              </a>
              <a
                href="tel:+966501234567"
                className="flex items-center gap-[10px] text-content-18 text-neutral-800 underline"
              >
                <Phone size={24} className="shrink-0 text-purple-3" />
                <span className="truncate">+966 50 123 4567</span>
              </a>
            </div>
            <div className="flex flex-1 flex-col gap-[10px]">
              <a
                href="mailto:support@helpet.app"
                className="flex items-center gap-[10px] text-content-18 text-neutral-800 underline"
              >
                <Envelope size={24} className="shrink-0 text-purple-3" />
                <span className="truncate">support@helpet.app</span>
              </a>
              <a
                href="tel:+966551234567"
                className="flex items-center gap-[10px] text-content-18 text-neutral-800 underline"
              >
                <Phone size={24} className="shrink-0 text-purple-3" />
                <span className="truncate">+966 55 123 4567</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-[20px]">
            <a href="#" aria-label="Instagram" className="text-neutral-800 transition-colors hover:text-purple-3">
              <InstagramLogo size={32} />
            </a>
            <a href="#" aria-label="Facebook" className="text-neutral-800 transition-colors hover:text-purple-3">
              <FacebookLogo size={32} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-neutral-800 transition-colors hover:text-purple-3">
              <LinkedinLogo size={32} />
            </a>
          </div>
        </div>

        {/* Middle — tilted polaroid photo (Figma group 609:1899) */}
        <div className="relative hidden h-[340px] w-[316px] shrink-0 items-center justify-center lg:flex">
          <div className="relative -rotate-[15deg] -scale-y-100">
            <div className="rotate-180 -scale-y-100 border-[14px] border-white bg-white shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/polaroid-photo-1.png"
                alt="Happy Helpet dog"
                className="h-[230px] w-[222px] object-cover"
              />
            </div>
          </div>
          <span className="absolute -bottom-1 left-1/2 h-[10px] w-[70%] -translate-x-1/2 rounded-full bg-purple-3/10 blur-md" />
        </div>

        {/* Right — link columns */}
        <div className="flex w-full max-w-[386px] justify-start gap-[20px] lg:justify-center">
          <div className="flex w-[180px] flex-col gap-[10px]">
            <p className="text-display-24 font-bold text-neutral-800">Service</p>
            {SERVICE_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-[10px] text-content-18 font-bold text-neutral-700 transition-colors hover:text-purple-3"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex w-[180px] flex-col gap-[10px]">
            <p className="text-display-24 font-bold text-neutral-800">Website</p>
            {WEBSITE_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-[10px] text-content-18 font-bold text-neutral-700 transition-colors hover:text-purple-3"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-purple-4/50 py-[16px] text-center text-small-14 text-neutral-600">
        © {new Date().getFullYear()} Helpet — Everything your pet needs.
      </div>
    </footer>
  );
}
