"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Heart, List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/lost-found", label: "Lost & Found" },
  { href: "/adoption", label: "Adoption" },
  { href: "/breeding", label: "Breeding Requests" },
  { href: "/account", label: "My Account" },
];

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-[10px]">
      {/* Paw badge — original Figma logo mark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/logo-badge.svg" alt="Helpet logo" className="size-[60px]" />
      <span className="flex flex-col leading-none">
        <span className="text-[26px] font-extrabold leading-[26px] text-purple-3">
          Helpet
        </span>
        <span className="text-desc-12 font-semibold text-green-4">
          everything your pet needs
        </span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0px_2px_20px_rgba(65,0,117,0.06)]">
      <div className="mx-auto flex h-[120px] w-full max-w-[1440px] items-center justify-between px-[24px] xl:px-[120px]">
        <Logo />

        {/* Center links — Assistant Bold 18, inactive #999 / active Purple3 */}
        <nav className="hidden items-center gap-[14px] lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative px-[12px] py-[15px] text-content-18 font-bold transition-colors hover:text-purple-3",
                isActive(l.href) ? "text-purple-3" : "text-neutral-300"
              )}
            >
              {l.label}
              {isActive(l.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-[12px] bottom-[8px] h-[3px] rounded-full bg-purple-3"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-[14px]">
          {/* 44px lilac icon chips from the design */}
          <button
            aria-label="Notifications"
            className="hidden size-[44px] items-center justify-center rounded-full bg-purple-4 text-purple-3 shadow-chip transition-transform hover:scale-105 sm:flex"
          >
            <Bell size={20} weight="regular" />
          </button>
          <button
            aria-label="Favorites"
            className="hidden size-[44px] items-center justify-center rounded-full bg-purple-4 text-purple-3 shadow-chip transition-transform hover:scale-105 sm:flex"
          >
            <Heart size={20} weight="regular" />
          </button>

          <Link
            href="/login"
            className="hidden py-[15px] text-content-18 font-bold text-purple-3 transition-colors hover:text-purple-1 md:block"
          >
            Register / <span className="text-neutral-300">Login</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex size-[44px] items-center justify-center rounded-full bg-purple-4 text-purple-3 shadow-chip lg:hidden"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-purple-5 bg-white lg:hidden"
          >
            <div className="flex flex-col px-[24px] py-[10px]">
              {[...LINKS, { href: "/login", label: "Register / Login" }].map(
                (l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "border-b border-purple-5 py-[15px] text-content-18 font-bold last:border-0",
                      isActive(l.href) ? "text-purple-3" : "text-neutral-700"
                    )}
                  >
                    {l.label}
                  </Link>
                )
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
