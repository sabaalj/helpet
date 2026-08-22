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
  X,
} from "@phosphor-icons/react";
import {
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

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

const PET_TYPES = ["Cat", "Dog", "Bird", "Rabbit", "Other"] as const;
const PET_GENDERS = ["Male", "Female", "Unknown"] as const;

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
function PetDetail({ label, value }: { label: string; value: string }) {  return (
    <div className="flex items-center justify-between gap-[10px] text-small-14">
      <span className="text-neutral-600">{label}</span>
      <span className="font-semibold text-neutral-800">
        {value || "Not provided"}
      </span>
    </div>
  );
}

type PetDraft = {
  name: string;
  type: string;
  age: string;
  gender: string;
};

/** Add / edit dialog for a single pet. */
function PetFormModal({
  mode,
  initial,
  saving,
  error,
  onSave,
  onClose,
}: {
  mode: "add" | "edit";
  initial: PetDraft;
  saving: boolean;
  error: string;
  onSave: (pet: PetDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<PetDraft>(initial);
  const [localError, setLocalError] = useState("");

  const update = (key: keyof PetDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const handleSave = () => {
    const cleaned: PetDraft = {
      name: draft.name.trim(),
      type: draft.type,
      age: draft.age.trim(),
      gender: draft.gender,
    };

    if (!cleaned.name) return setLocalError("Enter a name.");
    if (!cleaned.type) return setLocalError("Choose a type.");
    if (!cleaned.age) return setLocalError("Enter an age.");
    if (!cleaned.gender) return setLocalError("Choose a gender.");

    setLocalError("");
    onSave(cleaned);
  };

  const inputClass =
    "h-[48px] w-full rounded-btn border border-neutral-300 bg-white px-[15px] text-content-18 text-neutral-800 outline-none transition-colors focus:border-purple-3 disabled:opacity-60";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === "add" ? "Add a pet" : "Edit pet"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/40 p-[20px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-card bg-white p-[25px] shadow-card"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-title-20 font-bold text-purple-2">
            {mode === "add" ? "Add a pet" : "Edit pet"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-600 transition-colors hover:text-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-[20px] flex flex-col gap-[15px]">
          <label className="flex flex-col gap-[6px]">
            <span className="text-small-14 font-semibold text-neutral-800">
              Pet Name
            </span>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Luna"
              disabled={saving}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-[6px]">
            <span className="text-small-14 font-semibold text-neutral-800">
              Pet Type
            </span>
            <select
              value={draft.type}
              onChange={(e) => update("type", e.target.value)}
              disabled={saving}
              className={inputClass}
            >
              <option value="">Select a type</option>
              {PET_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-[6px]">
            <span className="text-small-14 font-semibold text-neutral-800">
              Pet Age
            </span>
            <input
              type="text"
              value={draft.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder="2 years"
              disabled={saving}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-[6px]">
            <span className="text-small-14 font-semibold text-neutral-800">
              Pet Gender
            </span>
            <select
              value={draft.gender}
              onChange={(e) => update("gender", e.target.value)}
              disabled={saving}
              className={inputClass}
            >
              <option value="">Select a gender</option>
              {PET_GENDERS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {(localError || error) && (
            <p role="alert" className="text-center text-sm text-red-600">
              {localError || error}
            </p>
          )}

          <div className="mt-[5px] flex gap-[10px]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-[48px] flex-1 rounded-btn border border-purple-4 text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              aria-busy={saving}
              className="btn-primary h-[48px] flex-1 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type ProfileDraft = {
  fullName: string;
  phone: string;
  city: string;
};

/** Edit dialog for the profile fields. Email is shown but not editable. */
function ProfileFormModal({
  initial,
  email,
  saving,
  error,
  onSave,
  onClose,
}: {
  initial: ProfileDraft;
  email: string;
  saving: boolean;
  error: string;
  onSave: (profile: ProfileDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ProfileDraft>(initial);
  const [localError, setLocalError] = useState("");

  const update = (key: keyof ProfileDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const handleSave = () => {
    const cleaned: ProfileDraft = {
      fullName: draft.fullName.trim(),
      phone: draft.phone.trim(),
      city: draft.city.trim(),
    };

    if (cleaned.fullName.length < 2) {
      return setLocalError("Enter your full name.");
    }

    if (cleaned.phone.replace(/\D/g, "").length < 8) {
      return setLocalError("Enter a valid phone number with country code.");
    }

    if (cleaned.city.length < 2) {
      return setLocalError("Enter the city you live in.");
    }

    setLocalError("");
    onSave(cleaned);
  };

  const inputClass =
    "h-[48px] w-full rounded-btn border border-neutral-300 bg-white px-[15px] text-content-18 text-neutral-800 outline-none transition-colors focus:border-purple-3 disabled:opacity-60";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/40 p-[20px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-card bg-white p-[25px] shadow-card"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-title-20 font-bold text-purple-2">
            Edit information
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-600 transition-colors hover:text-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-[20px] flex flex-col gap-[15px]">
          <label className="flex flex-col gap-[6px]">
            <span className="text-small-14 font-semibold text-neutral-800">
              Full name
            </span>
            <input
              type="text"
              value={draft.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Your full name"
              disabled={saving}
              className={inputClass}
            />
          </label>

          <div className="flex flex-col gap-[6px]">
            <span className="text-small-14 font-semibold text-neutral-800">
              Email
            </span>
            <input
              type="email"
              value={email}
              disabled
              readOnly
              className={cn(inputClass, "bg-purple-5/40 text-neutral-600")}
            />
            <p className="text-desc-12 text-neutral-600">
              Your email is tied to your login and can&apos;t be changed here.
            </p>
          </div>

          <label className="flex flex-col gap-[6px]">
            <span className="text-small-14 font-semibold text-neutral-800">
              Phone number
            </span>
            <input
              type="tel"
              value={draft.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+966 5X XXX XXXX"
              disabled={saving}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-[6px]">
            <span className="text-small-14 font-semibold text-neutral-800">
              City
            </span>
            <input
              type="text"
              value={draft.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Riyadh"
              disabled={saving}
              className={inputClass}
            />
          </label>

          {(localError || error) && (
            <p role="alert" className="text-center text-sm text-red-600">
              {localError || error}
            </p>
          )}

          <div className="mt-[5px] flex gap-[10px]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-[48px] flex-1 rounded-btn border border-purple-4 text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              aria-busy={saving}
              className="btn-primary h-[48px] flex-1 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Delete-account dialog. Firebase requires a recent login before deleting,
 * so this collects the password (or reopens the Google popup) first.
 */
function DeleteAccountModal({
  isGoogleAccount,
  petCount,
  deleting,
  error,
  onConfirm,
  onClose,
}: {
  isGoogleAccount: boolean;
  petCount: number;
  deleting: boolean;
  error: string;
  onConfirm: (password: string) => void;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [localError, setLocalError] = useState("");

  const handleConfirm = () => {
    if (confirmText.trim().toUpperCase() !== "DELETE") {
      return setLocalError('Type DELETE to confirm.');
    }

    if (!isGoogleAccount && !password) {
      return setLocalError("Enter your password to confirm.");
    }

    setLocalError("");
    onConfirm(password);
  };

  const inputClass =
    "h-[48px] w-full rounded-btn border border-neutral-300 bg-white px-[15px] text-content-18 text-neutral-800 outline-none transition-colors focus:border-red-2 disabled:opacity-60";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Delete account"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/40 p-[20px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-card bg-white p-[25px] shadow-card"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-title-20 font-bold text-red-2">
            Delete your account
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-600 transition-colors hover:text-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-[20px] flex flex-col gap-[15px]">
          <div className="rounded-card bg-red-2/10 px-[15px] py-[12px]">
            <p className="text-small-14 font-bold text-neutral-800">
              This permanently removes:
            </p>

            <ul className="mt-[8px] flex list-disc flex-col gap-[4px] pl-[18px] text-small-14 text-neutral-700">
              <li>Your profile details</li>
              <li>
                {petCount > 0
                  ? `Your ${petCount} saved ${petCount === 1 ? "pet" : "pets"}`
                  : "Any saved pets"}
              </li>
              <li>Your login — you won&apos;t be able to sign back in</li>
            </ul>

            <p className="mt-[10px] text-small-14 text-neutral-700">
              This can&apos;t be undone.
            </p>
          </div>

          {isGoogleAccount ? (
            <p className="text-small-14 text-neutral-700">
              You&apos;ll be asked to confirm with Google before the account is
              removed.
            </p>
          ) : (
            <label className="flex flex-col gap-[6px]">
              <span className="text-small-14 font-semibold text-neutral-800">
                Confirm your password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={deleting}
                autoComplete="current-password"
                className={inputClass}
              />
            </label>
          )}

          <label className="flex flex-col gap-[6px]">
            <span className="text-small-14 font-semibold text-neutral-800">
              Type DELETE to confirm
            </span>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              disabled={deleting}
              className={inputClass}
            />
          </label>

          {(localError || error) && (
            <p role="alert" className="text-center text-sm text-red-600">
              {localError || error}
            </p>
          )}

          <div className="mt-[5px] flex gap-[10px]">
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="h-[48px] flex-1 rounded-btn border border-purple-4 text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5 disabled:opacity-60"
            >
              Keep my account
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={deleting}
              aria-busy={deleting}
              className="h-[48px] flex-1 rounded-btn bg-red-2 text-small-14 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </div>
      </div>
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

  // Profile editing.
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const [pets, setPets] = useState<PetRecord[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState("");

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Account deletion.
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accountDeleting, setAccountDeleting] = useState(false);
  const [accountDeleteError, setAccountDeleteError] = useState("");

  // Pet add / edit / delete.
  const [petModal, setPetModal] = useState<
    { mode: "add" } | { mode: "edit"; pet: PetRecord } | null
  >(null);
  const [petSaving, setPetSaving] = useState(false);
  const [petSaveError, setPetSaveError] = useState("");
  const [petPendingDelete, setPetPendingDelete] = useState<PetRecord | null>(
    null
  );
  const [petDeleting, setPetDeleting] = useState(false);
  const [petActionError, setPetActionError] = useState("");

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

  const describeWriteError = (
    error: unknown,
    verb: string,
    subject = "pet"
  ) => {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: string }).code)
        : "";

    if (code === "permission-denied") {
      return `You don't have permission to ${verb} this ${subject}. Check your Firestore security rules.`;
    }

    if (code === "unavailable" || code === "deadline-exceeded") {
      return "Can't reach the database. Check your connection and try again.";
    }

    return `Couldn't ${verb} the ${subject}. Please try again.`;
  };

  const handleSaveProfile = async (draft: ProfileDraft) => {
    if (!authUser || profileSaving) return;

    setProfileSaving(true);
    setProfileSaveError("");

    try {
      // setDoc with merge instead of updateDoc: this also creates the
      // document for accounts that never got one written at signup.
      await setDoc(
        doc(db, "users", authUser.uid),
        {
          fullName: draft.fullName,
          phone: draft.phone,
          city: draft.city,
          email: userData.email || authUser.email || "",
        },
        { merge: true }
      );

      if (!mountedRef.current) return;

      // Keep the auth record in step with Firestore, otherwise the header
      // would keep showing the old name.
      if (draft.fullName !== authUser.displayName) {
        try {
          await updateProfile(authUser, { displayName: draft.fullName });
        } catch (nameError) {
          console.error("Failed to update display name:", nameError);
        }
      }

      setUserData((current) => ({ ...current, ...draft }));
      setProfileMissing(false);
      setProfileSaving(false);
      setProfileModalOpen(false);
      setProfileSaved(true);

      window.setTimeout(() => {
        if (mountedRef.current) setProfileSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);

      if (!mountedRef.current) return;

      setProfileSaving(false);
      setProfileSaveError(describeWriteError(error, "update", "profile"));
    }
  };

  const handleSavePet = async (draft: PetDraft) => {
    if (!authUser || petSaving || !petModal) return;

    setPetSaving(true);
    setPetSaveError("");
    setPetActionError("");

    try {
      if (petModal.mode === "add") {
        // Firestore generates the id, same as at signup.
        const created = await addDoc(
          collection(db, "users", authUser.uid, "pets"),
          draft
        );

        if (!mountedRef.current) return;

        setPets((current) => [...current, { id: created.id, ...draft }]);
      } else {
        const petId = petModal.pet.id;

        await updateDoc(doc(db, "users", authUser.uid, "pets", petId), draft);

        if (!mountedRef.current) return;

        setPets((current) =>
          current.map((pet) =>
            pet.id === petId ? { ...pet, ...draft } : pet
          )
        );
      }

      setPetSaving(false);
      setPetModal(null);
    } catch (error) {
      console.error("Failed to save pet:", error);

      if (!mountedRef.current) return;

      setPetSaving(false);
      setPetSaveError(
        describeWriteError(error, petModal.mode === "add" ? "add" : "update")
      );
    }
  };

  const handleDeletePet = async () => {
    if (!authUser || !petPendingDelete || petDeleting) return;

    const petId = petPendingDelete.id;

    setPetDeleting(true);
    setPetActionError("");

    try {
      await deleteDoc(doc(db, "users", authUser.uid, "pets", petId));

      if (!mountedRef.current) return;

      setPets((current) => current.filter((pet) => pet.id !== petId));
      setPetDeleting(false);
      setPetPendingDelete(null);
    } catch (error) {
      console.error("Failed to delete pet:", error);

      if (!mountedRef.current) return;

      setPetDeleting(false);
      setPetPendingDelete(null);
      setPetActionError(describeWriteError(error, "delete"));
    }
  };

  const handleDeleteAccount = async (password: string) => {
    if (!authUser || accountDeleting) return;

    setAccountDeleting(true);
    setAccountDeleteError("");

    try {
      // 1. Prove it's really them. Firebase refuses to delete an account
      //    whose last sign-in is stale.
      const usesGoogle = authUser.providerData.some(
        (provider) => provider.providerId === "google.com"
      );

      if (usesGoogle) {
        await reauthenticateWithPopup(authUser, new GoogleAuthProvider());
      } else {
        const credential = EmailAuthProvider.credential(
          authUser.email || "",
          password
        );

        await reauthenticateWithCredential(authUser, credential);
      }

      // 2. Firestore first, while the account still has permission to write.
      //    Deleting the auth user first would strand this data forever.
      const petsSnapshot = await getDocs(
        collection(db, "users", authUser.uid, "pets")
      );

      await Promise.all(
        petsSnapshot.docs.map((petDoc) =>
          deleteDoc(doc(db, "users", authUser.uid, "pets", petDoc.id))
        )
      );

      await deleteDoc(doc(db, "users", authUser.uid));

      // 3. Finally the login itself. This signs the user out as a side
      //    effect, so the auth listener sends them to /login.
      await deleteUser(authUser);

      if (!mountedRef.current) return;

      router.replace("/");
    } catch (error) {
      console.error("Failed to delete account:", error);

      if (!mountedRef.current) return;

      const code =
        typeof error === "object" && error !== null && "code" in error
          ? String((error as { code?: string }).code)
          : "";

      setAccountDeleting(false);

      switch (code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setAccountDeleteError("That password isn't right. Try again.");
          break;
        case "auth/too-many-requests":
          setAccountDeleteError(
            "Too many attempts. Wait a few minutes and try again."
          );
          break;
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
          setAccountDeleteError("Confirmation cancelled. Your account is safe.");
          break;
        case "auth/requires-recent-login":
          setAccountDeleteError(
            "For security, log out and back in, then delete your account."
          );
          break;
        case "permission-denied":
          setAccountDeleteError(
            "You don't have permission to remove this data. Check your Firestore security rules."
          );
          break;
        case "unavailable":
        case "deadline-exceeded":
          setAccountDeleteError(
            "Can't reach the database. Check your connection and try again."
          );
          break;
        default:
          setAccountDeleteError("Couldn't delete your account. Please try again.");
      }
    }
  };

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

            <button
              onClick={() => {
                setAccountDeleteError("");
                setDeleteModalOpen(true);
              }}
              disabled={loggingOut || accountDeleting}
              className="mt-[20px] flex items-center gap-[12px] border-t border-purple-4/40 px-[10px] pt-[16px] text-small-14 font-semibold text-neutral-600 transition-colors hover:text-red-2 disabled:opacity-60"
            >
              <Trash size={18} />
              Delete account
            </button>
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

                        <div className="flex items-center gap-[12px]">
                          {profileSaved && (
                            <span
                              role="status"
                              className="text-small-14 font-semibold text-green-3"
                            >
                              Saved
                            </span>
                          )}

                          <button
                            onClick={() => {
                              setProfileSaveError("");
                              setProfileModalOpen(true);
                            }}
                            disabled={profileLoading || !!profileError}
                            className="flex items-center gap-[6px] rounded-btn border border-purple-4 px-[15px] py-[6px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5 disabled:opacity-60"
                          >
                            Edit <Pencil size={15} />
                          </button>
                        </div>
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
                            <div className="mt-[20px] flex flex-wrap items-center justify-between gap-[12px] rounded-card bg-yellow/10 px-[15px] py-[12px]">
                              <p className="text-small-14 text-neutral-700">
                                Your profile information hasn&apos;t been saved
                                yet. Your account is active — add your details
                                to complete it.
                              </p>

                              <button
                                onClick={() => {
                                  setProfileSaveError("");
                                  setProfileModalOpen(true);
                                }}
                                className="shrink-0 rounded-btn border border-purple-4 bg-white px-[15px] py-[6px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5"
                              >
                                Add details
                              </button>
                            </div>
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
                        <button
                          onClick={() => {
                            setPetSaveError("");
                            setPetModal({ mode: "add" });
                          }}
                          disabled={petsLoading}
                          className="flex items-center gap-[6px] rounded-btn border border-purple-4 px-[15px] py-[8px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5 disabled:opacity-60"
                        >
                          Add Another Pet <Plus size={15} weight="bold" />
                        </button>
                      </div>
                    </div>

                    {petActionError && (
                      <p
                        role="alert"
                        className="mt-[15px] text-small-14 text-red-2"
                      >
                        {petActionError}
                      </p>
                    )}

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

                        <button
                          onClick={() => {
                            setPetSaveError("");
                            setPetModal({ mode: "add" });
                          }}
                          className="btn-primary mt-[15px] h-[44px] px-[24px] text-small-14"
                        >
                          Add your first pet
                        </button>
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

                            <div className="flex gap-[10px] border-t border-purple-4/40 pt-[12px]">
                              <button
                                onClick={() => {
                                  setPetSaveError("");
                                  setPetModal({ mode: "edit", pet });
                                }}
                                className="flex flex-1 items-center justify-center gap-[6px] rounded-btn border border-purple-3 py-[6px] text-small-14 font-semibold text-purple-3 transition-colors hover:bg-purple-5"
                              >
                                <Pencil size={15} /> Edit
                              </button>

                              <button
                                onClick={() => {
                                  setPetActionError("");
                                  setPetPendingDelete(pet);
                                }}
                                className="flex flex-1 items-center justify-center gap-[6px] rounded-btn border border-red-2 py-[6px] text-small-14 font-semibold text-red-2 transition-colors hover:bg-red-2/10"
                              >
                                <Trash size={15} /> Delete
                              </button>
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

      {deleteModalOpen && (
        <DeleteAccountModal
          isGoogleAccount={authUser.providerData.some(
            (provider) => provider.providerId === "google.com"
          )}
          petCount={pets.length}
          deleting={accountDeleting}
          error={accountDeleteError}
          onConfirm={handleDeleteAccount}
          onClose={() => {
            if (!accountDeleting) {
              setDeleteModalOpen(false);
              setAccountDeleteError("");
            }
          }}
        />
      )}

      {profileModalOpen && (
        <ProfileFormModal
          initial={{
            fullName: userData.fullName,
            phone: userData.phone,
            city: userData.city,
          }}
          email={userData.email || authUser.email || ""}
          saving={profileSaving}
          error={profileSaveError}
          onSave={handleSaveProfile}
          onClose={() => {
            if (!profileSaving) {
              setProfileModalOpen(false);
              setProfileSaveError("");
            }
          }}
        />
      )}

      {petModal && (
        <PetFormModal
          // Remounts on mode/pet change so the draft always starts fresh.
          key={petModal.mode === "edit" ? petModal.pet.id : "add"}
          mode={petModal.mode}
          initial={
            petModal.mode === "edit"
              ? {
                  name: petModal.pet.name,
                  type: petModal.pet.type,
                  age: petModal.pet.age,
                  gender: petModal.pet.gender,
                }
              : { name: "", type: "", age: "", gender: "" }
          }
          saving={petSaving}
          error={petSaveError}
          onSave={handleSavePet}
          onClose={() => {
            if (!petSaving) {
              setPetModal(null);
              setPetSaveError("");
            }
          }}
        />
      )}

      {petPendingDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/40 p-[20px]"
          onClick={() => !petDeleting && setPetPendingDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[400px] rounded-card bg-white p-[25px] shadow-card"
          >
            <h3 className="text-title-20 font-bold text-purple-2">
              Delete this pet?
            </h3>

            <p className="mt-[10px] text-content-18 text-neutral-700">
              <span className="font-bold">
                {petPendingDelete.name || "This pet"}
              </span>{" "}
              will be removed from your account. This can&apos;t be undone.
            </p>

            <div className="mt-[20px] flex gap-[10px]">
              <button
                type="button"
                onClick={() => setPetPendingDelete(null)}
                disabled={petDeleting}
                className="h-[48px] flex-1 rounded-btn border border-purple-4 text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeletePet}
                disabled={petDeleting}
                aria-busy={petDeleting}
                className="h-[48px] flex-1 rounded-btn bg-red-2 text-small-14 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {petDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
