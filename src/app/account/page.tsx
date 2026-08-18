"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowsClockwise,
  ClipboardText,
  Envelope,
  IdentificationCard,
  MapPin,
  PawPrint,
  Pencil,
  Phone,
  Plus,
  SignOut,
  Trash,
  User,
  UserCircle,
} from "@phosphor-icons/react";
import {
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import {
  MY_LISTINGS,
  PROFILE,
  type ListingStatus,
  type MyListing,
} from "@/data/content";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";

type Tab = "profile" | "pets" | "listings";

type PetRecord = {
  id: string;
  name: string;
  type: string;
  age: string;
  gender: string;
};

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <UserCircle size={20} /> },
  { id: "pets", label: "My Pets", icon: <PawPrint size={20} /> },
  { id: "listings", label: "My Listings", icon: <ClipboardText size={20} /> },
];

const STATUS_STYLE: Record<ListingStatus, string> = {
  Active: "bg-green-6 text-green-3",
  Pending: "bg-yellow/20 text-[#8a6d00]",
  Closed: "bg-red-2/10 text-red-2",
};

/** Turns a FirebaseError into something worth showing a person. */
function describeFirestoreError(error: unknown, subject: string) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: string }).code)
      : "";

  if (code === "permission-denied") {
    return `You don't have permission to view your ${subject}. Check your Firestore security rules.`;
  }

  if (code === "unavailable" || code === "deadline-exceeded") {
    return "Can't reach the database. Check your connection and try again.";
  }

  if (code === "unauthenticated") {
    return "Your session expired. Sign in again to see your account.";
  }

  return `We couldn't load your ${subject}. Please try again.`;
}

function StatusChip({ status }: { status: ListingStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-[12px] py-[4px] text-desc-12 font-bold",
        STATUS_STYLE[status]
      )}
    >
      {status}
    </span>
  );
}

function ListingRow({ item }: { item: MyListing }) {
  return (
    <div className="flex flex-wrap items-center gap-[15px] border-b border-purple-5 py-[15px] last:border-0">
      <div className="flex size-[54px] items-center justify-center overflow-hidden rounded-card bg-purple-5/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.photo} alt="" className="size-full object-contain" />
      </div>

      <div className="min-w-[180px] flex-1">
        <p className="text-content-18 font-bold text-neutral-800">
          {item.title}
        </p>
        <p className="text-small-14 text-neutral-600">{item.meta}</p>
      </div>

      <StatusChip status={item.status} />

      <div className="flex gap-[10px]">
        <button className="flex items-center gap-[6px] rounded-btn border border-purple-3 px-[15px] py-[6px] text-small-14 font-semibold text-purple-3 transition-colors hover:bg-purple-5">
          <Pencil size={15} /> Edit
        </button>

        <button className="flex items-center gap-[6px] rounded-btn border border-red-2 px-[15px] py-[6px] text-small-14 font-semibold text-red-2 transition-colors hover:bg-red-2/10">
          <Trash size={15} /> Delete
        </button>
      </div>
    </div>
  );
}

/** One row of a pet card: label on the left, value on the right. */
function PetDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-[10px] text-small-14">
      <span className="text-neutral-600">{label}</span>
      <span className="font-semibold text-neutral-800">
        {value || "Not provided"}
      </span>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("profile");

  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
  });

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileMissing, setProfileMissing] = useState(false);

  const [pets, setPets] = useState<PetRecord[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState("");

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Guards against setting state after the page unmounts (e.g. the user
  // navigates away while a Firestore read is still in flight).
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadProfile = useCallback(async (user: FirebaseUser) => {
    setProfileLoading(true);
    setProfileError("");
    setProfileMissing(false);

    try {
      // Always read the document keyed by the signed-in user's own UID.
      const userSnapshot = await getDoc(doc(db, "users", user.uid));

      if (!mountedRef.current) return;

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();

        setUserData({
          fullName: data.fullName || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          city: data.city || "",
        });
      } else {
        // The account exists but nothing was written to Firestore for it.
        // This is not a permission problem and shouldn't read like one.
        setProfileMissing(true);

        setUserData({
          fullName: "",
          email: user.email || "",
          phone: "",
          city: "",
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);

      if (!mountedRef.current) return;

      setProfileError(describeFirestoreError(error, "profile details"));

      setUserData({
        fullName: "",
        email: user.email || "",
        phone: "",
        city: "",
      });
    } finally {
      if (mountedRef.current) setProfileLoading(false);
    }
  }, []);

  const loadPets = useCallback(async (user: FirebaseUser) => {
    setPetsLoading(true);
    setPetsError("");

    try {
      // users/{uid}/pets — scoped to this user, so no one else's pets can
      // ever appear here.
      const petsSnapshot = await getDocs(
        collection(db, "users", user.uid, "pets")
      );

      if (!mountedRef.current) return;

      setPets(
        petsSnapshot.docs.map((petDoc) => {
          const data = petDoc.data();

          return {
            id: petDoc.id,
            name: data.name || "",
            type: data.type || "",
            age: data.age || "",
            gender: data.gender || "",
          };
        })
      );
    } catch (error) {
      console.error("Error loading pets:", error);

      if (!mountedRef.current) return;

      setPets([]);
      setPetsError(describeFirestoreError(error, "pets"));
    } finally {
      if (mountedRef.current) setPetsLoading(false);
    }
  }, []);

  const loadAccount = useCallback(
    (user: FirebaseUser) => {
      void loadProfile(user);
      void loadPets(user);
    },
    [loadProfile, loadPets]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!mountedRef.current) return;

        setCheckingAuth(false);

        if (!user) {
          // Clear anything already on screen before leaving the page.
          setAuthUser(null);
          setUserData({ fullName: "", email: "", phone: "", city: "" });
          setPets([]);
          setProfileLoading(false);
          setPetsLoading(false);
          router.replace("/login");
          return;
        }

        setAuthUser(user);
        loadAccount(user);
      },
      (error) => {
        console.error("Auth state error:", error);

        if (!mountedRef.current) return;

        setCheckingAuth(false);
        setProfileLoading(false);
        setPetsLoading(false);
        setAuthError(
          "We couldn't verify your session. Try signing in again."
        );
      }
    );

    return () => unsubscribe();
  }, [router, loadAccount]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLogoutError("");
    setLoggingOut(true);

    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);

      if (!mountedRef.current) return;

      setLoggingOut(false);
      setLogoutError("Couldn't log you out. Please try again.");
    }
  };

  // Nothing private renders until Firebase has confirmed who is signed in.
  if (checkingAuth) {
    return (
      <div className="bg-purple-5/40">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center px-[24px] py-[120px] xl:px-[120px]">
          <p
            role="status"
            aria-live="polite"
            className="text-content-18 text-neutral-700"
          >
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="bg-purple-5/40">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-[15px] px-[24px] py-[120px] xl:px-[120px]">
          <p role="alert" className="text-content-18 text-neutral-800">
            {authError}
          </p>

          <button
            onClick={() => router.replace("/login")}
            className="btn-primary h-[46px] px-[24px]"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="bg-purple-5/40">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center px-[24px] py-[120px] xl:px-[120px]">
          <p
            role="status"
            aria-live="polite"
            className="text-content-18 text-neutral-700"
          >
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const busy = profileLoading || petsLoading;

  return (
    <div className="bg-purple-5/40">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[30px] px-[24px] py-[40px] lg:flex-row xl:px-[120px]">

        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-[285px]">
          <div className="flex items-center gap-[12px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFILE.avatar}
              alt="User"
              className="size-[54px] rounded-full border-2 border-purple-4 object-cover"
            />

            <div className="flex-1">
              <p className="text-title-20 font-bold text-neutral-800">
                {profileLoading
                  ? "Loading..."
                  : userData.fullName || authUser.email || "User"}
              </p>

              <p className="text-small-14 text-neutral-600">
                Dashboard{" "}
                <span className="font-semibold text-purple-1">User</span>
              </p>
            </div>

            <button
              onClick={() => loadAccount(authUser)}
              disabled={busy}
              aria-label="Refresh account"
              title="Refresh account"
              className="text-purple-1 transition-opacity disabled:opacity-50"
            >
              <ArrowsClockwise size={20} className={cn(busy && "animate-spin")} />
            </button>
          </div>

          <nav className="mt-[25px] flex flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-[12px] border-b border-purple-4/40 px-[10px] py-[16px] text-content-18 font-bold transition-colors",
                  tab === t.id
                    ? "text-purple-3"
                    : "text-neutral-700 hover:text-purple-3"
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              aria-busy={loggingOut}
              className="flex items-center gap-[12px] px-[10px] py-[16px] text-content-18 font-bold text-neutral-700 transition-colors hover:text-red-2 disabled:opacity-60"
            >
              <SignOut size={20} />
              {loggingOut ? "Logging out..." : "Log out"}
            </button>

            {logoutError && (
              <p role="alert" className="px-[10px] text-small-14 text-red-2">
                {logoutError}
              </p>
            )}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {/* Tab bar */}
          <div className="flex overflow-hidden rounded-t-card bg-neutral-800/[0.04]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-[8px] py-[18px] text-content-18 font-bold transition-colors",
                  tab === t.id
                    ? "bg-white text-purple-3"
                    : "text-neutral-300 hover:text-neutral-700"
                )}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>

                {tab === t.id && (
                  <motion.span
                    layoutId="account-tab-rule"
                    className="absolute inset-x-0 bottom-0 h-[3px] bg-purple-3"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="rounded-b-card bg-white p-[25px] shadow-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Profile */}
                {tab === "profile" && (
                  <div className="flex flex-col gap-[20px]">
                    <div className="rounded-card border border-purple-4/50 p-[25px]">
                      <div className="flex items-center justify-between">
                        <h2 className="text-title-20 font-bold text-purple-2">
                          Information
                        </h2>

                        <button className="flex items-center gap-[6px] rounded-btn border border-purple-4 px-[15px] py-[6px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5">
                          Edit <Pencil size={15} />
                        </button>
                      </div>

                      {profileLoading ? (
                        <p
                          role="status"
                          aria-live="polite"
                          className="mt-[20px] text-neutral-600"
                        >
                          Loading your information...
                        </p>
                      ) : profileError ? (
                        <div className="mt-[20px] flex flex-wrap items-center gap-[15px]">
                          <p role="alert" className="text-content-18 text-red-2">
                            {profileError}
                          </p>

                          <button
                            onClick={() => loadProfile(authUser)}
                            className="flex items-center gap-[6px] rounded-btn border border-purple-4 px-[15px] py-[6px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5"
                          >
                            <ArrowsClockwise size={15} /> Try again
                          </button>
                        </div>
                      ) : (
                        <>
                          {profileMissing && (
                            <p className="mt-[20px] rounded-card bg-yellow/10 px-[15px] py-[12px] text-small-14 text-neutral-700">
                              Your profile information hasn&apos;t been saved
                              yet. Your account is active — add your details
                              with Edit to complete it.
                            </p>
                          )}

                          <div className="mt-[20px] grid grid-cols-1 gap-y-[20px] sm:grid-cols-2">

                            <div>
                              <p className="flex items-center gap-[8px] text-small-14 text-neutral-600">
                                <IdentificationCard size={18} />
                                Full name
                              </p>

                              <p className="mt-[5px] text-content-18 text-neutral-800">
                                {userData.fullName || "Not provided"}
                              </p>
                            </div>

                            <div>
                              <p className="flex items-center gap-[8px] text-small-14 text-neutral-600">
                                <Envelope size={18} />
                                Email
                              </p>

                              <p className="mt-[5px] text-content-18 text-neutral-800">
                                {userData.email || "Not provided"}
                              </p>
                            </div>

                            <div>
                              <p className="flex items-center gap-[8px] text-small-14 text-neutral-600">
                                <Phone size={18} />
                                Phone number
                              </p>

                              <p className="mt-[5px] text-content-18 text-neutral-800">
                                {userData.phone || "Not provided"}
                              </p>
                            </div>

                            <div>
                              <p className="flex items-center gap-[8px] text-small-14 text-neutral-600">
                                <MapPin size={18} />
                                City
                              </p>

                              <p className="mt-[5px] text-content-18 text-neutral-800">
                                {userData.city || "Not provided"}
                              </p>
                            </div>

                          </div>
                        </>
                      )}
                    </div>

                    <div className="rounded-card border border-purple-4/50 p-[25px]">
                      <h2 className="text-title-20 font-bold text-purple-2">
                        Activity
                      </h2>

                      <div className="mt-[15px] grid grid-cols-3 gap-[15px] text-center">
                        {[
                          { v: MY_LISTINGS.lost.length, l: "Lost reports" },
                          { v: MY_LISTINGS.adoption.length, l: "Adoption listings" },
                          { v: MY_LISTINGS.breeding.length, l: "Breeding requests" },
                        ].map((s) => (
                          <div
                            key={s.l}
                            className="rounded-card bg-purple-5/60 py-[18px]"
                          >
                            <p className="text-header-28 font-bold text-purple-3">
                              {s.v}
                            </p>

                            <p className="text-small-14 text-neutral-700">
                              {s.l}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* My Pets */}
                {tab === "pets" && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-[15px]">
                      <h2 className="flex items-center gap-[8px] text-title-20 font-bold text-purple-2">
                        My Pets

                        {!petsLoading && !petsError && pets.length > 0 && (
                          <span className="rounded-full bg-purple-5 px-[10px] py-[2px] text-desc-12 font-bold text-purple-3">
                            {pets.length}
                          </span>
                        )}
                      </h2>

                      <div className="flex gap-[10px]">
                        <button className="flex items-center gap-[6px] rounded-btn border border-purple-4 px-[15px] py-[8px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5">
                          Add Another Pet <Plus size={15} weight="bold" />
                        </button>

                        <button className="flex items-center gap-[6px] rounded-btn border border-purple-4 px-[15px] py-[8px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5">
                          Update Pet <Pencil size={15} />
                        </button>
                      </div>
                    </div>

                    {petsLoading ? (
                      <p
                        role="status"
                        aria-live="polite"
                        className="mt-[20px] text-neutral-600"
                      >
                        Loading your pets...
                      </p>
                    ) : petsError ? (
                      <div className="mt-[20px] flex flex-wrap items-center gap-[15px]">
                        <p role="alert" className="text-content-18 text-red-2">
                          {petsError}
                        </p>

                        <button
                          onClick={() => loadPets(authUser)}
                          className="flex items-center gap-[6px] rounded-btn border border-purple-4 px-[15px] py-[6px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5"
                        >
                          <ArrowsClockwise size={15} /> Try again
                        </button>
                      </div>
                    ) : pets.length === 0 ? (
                      <div className="mt-[20px] rounded-card bg-purple-5/40 px-[20px] py-[30px] text-center">
                        <PawPrint
                          size={32}
                          weight="fill"
                          className="mx-auto text-purple-4"
                        />

                        <p className="mt-[10px] text-content-18 font-bold text-neutral-800">
                          You haven&apos;t added any pets yet.
                        </p>

                        <p className="mt-[5px] text-small-14 text-neutral-600">
                          Pets you add at signup show up here.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-[20px] grid grid-cols-1 gap-[20px] sm:grid-cols-2 xl:grid-cols-3">
                        {pets.map((pet) => (
                          <div
                            key={pet.id}
                            className="flex flex-col gap-[12px] rounded-card border border-purple-4/50 p-[15px] transition-shadow hover:shadow-card"
                          >
                            <div className="flex h-[140px] items-center justify-center overflow-hidden rounded-card bg-purple-5/60">
                              <PawPrint
                                size={54}
                                weight="fill"
                                className="text-purple-4"
                              />
                            </div>

                            <div className="flex items-center justify-between gap-[10px]">
                              <p className="text-content-18 font-bold text-neutral-800">
                                {pet.name || "Unnamed pet"}
                              </p>

                              {pet.type && (
                                <span className="flex shrink-0 items-center gap-[5px] rounded-full bg-purple-5 px-[10px] py-[3px] text-desc-12 font-semibold text-purple-3">
                                  <PawPrint size={12} weight="fill" />
                                  {pet.type}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col gap-[8px] border-t border-purple-4/40 pt-[12px]">
                              <PetDetail label="Type" value={pet.type} />
                              <PetDetail label="Age" value={pet.age} />
                              <PetDetail label="Gender" value={pet.gender} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* My Listings */}
                {tab === "listings" && (
                  <div className="flex flex-col gap-[30px]">
                    {(
                      [
                        ["Lost Pets", MY_LISTINGS.lost],
                        ["Adoption Listings", MY_LISTINGS.adoption],
                        ["Breeding Requests", MY_LISTINGS.breeding],
                      ] as const
                    ).map(([title, items]) => (
                      <div key={title}>
                        <h2 className="flex items-center gap-[8px] text-title-20 font-bold text-purple-2">
                          <User size={20} className="hidden" />
                          {title}

                          <span className="rounded-full bg-purple-5 px-[10px] py-[2px] text-desc-12 font-bold text-purple-3">
                            {items.length}
                          </span>
                        </h2>

                        <div className="mt-[5px]">
                          {items.length > 0 ? (
                            items.map((item) => (
                              <ListingRow key={item.id} item={item} />
                            ))
                          ) : (
                            <p className="py-[15px] text-small-14 text-neutral-600">
                              Nothing here yet.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
