"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Heart, List, SignOut, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  // First name only, falling back to the email handle.
  const displayName =
    user?.displayName?.trim().split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Account";

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

          {/* Nothing auth-related renders until Firebase has answered, so the
              wrong state never flashes on first paint. */}
          {checkingAuth ? (
            <span
              aria-hidden
              className="hidden h-[24px] w-[130px] animate-pulse rounded-full bg-purple-5 md:block"
            />
          ) : user ? (
            <div className="hidden items-center gap-[14px] md:flex">
              <Link
                href="/account"
                className="py-[15px] text-content-18 font-bold text-purple-3 transition-colors hover:text-purple-1"
              >
                Hi, {displayName}
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                aria-busy={loggingOut}
                className="flex items-center gap-[6px] py-[15px] text-content-18 font-bold text-neutral-300 transition-colors hover:text-red-2 disabled:opacity-60"
              >
                <SignOut size={18} />
                {loggingOut ? "..." : "Log out"}
              </button>
            </div>
          ) : (
            /* Two separate links — the whole thing used to point at /login,
               so clicking "Register" never reached the signup page. */
            <span className="hidden py-[15px] text-content-18 font-bold md:block">
              <Link
                href="/signup"
                className="text-purple-3 transition-colors hover:text-purple-1"
              >
                Register
              </Link>
              <span className="text-neutral-300"> / </span>
              <Link
                href="/login"
                className="text-neutral-300 transition-colors hover:text-purple-3"
              >
                Login
              </Link>
            </span>
          )}

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
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "border-b border-purple-5 py-[15px] text-content-18 font-bold",
                    isActive(l.href) ? "text-purple-3" : "text-neutral-700"
                  )}
                >
                  {l.label}
                </Link>
              ))}

              {!checkingAuth &&
                (user ? (
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-[8px] py-[15px] text-left text-content-18 font-bold text-neutral-700 transition-colors hover:text-red-2 disabled:opacity-60"
                  >
                    <SignOut size={18} />
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className={cn(
                        "border-b border-purple-5 py-[15px] text-content-18 font-bold",
                        isActive("/signup") ? "text-purple-3" : "text-neutral-700"
                      )}
                    >
                      Register
                    </Link>

                    <Link
                      href="/login"
                      className={cn(
                        "py-[15px] text-content-18 font-bold",
                        isActive("/login") ? "text-purple-3" : "text-neutral-700"
                      )}
                    >
                      Login
                    </Link>
                  </>
                ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
