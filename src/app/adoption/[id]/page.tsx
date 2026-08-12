"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  PawPrint,
  Phone,
} from "@phosphor-icons/react";
import { ADOPTION_PETS } from "@/data/content";

export default function AdoptionDetailsPage() {
  const params = useParams();

  const pet = ADOPTION_PETS.find((p) => p.id === params.id);

  if (!pet) {
    return (
      <main className="min-h-screen bg-purple-5/40">
        <div className="mx-auto max-w-[1200px] px-[24px] py-[100px] text-center">
          <h1 className="text-display-36 font-bold uppercase text-purple-3">
            Pet not found
          </h1>

          <p className="mt-[10px] text-neutral-600">
            This adoption listing may no longer be available.
          </p>

          <Link href="/adoption" className="btn-primary mt-[25px]">
            Back to Adoption List
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* PAGE BACKGROUND */}
      <img
        src="/assets/hero-backdrop.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[950px] w-full object-cover opacity-70"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-[250px] top-[600px] size-[600px] rounded-full bg-purple-5/60"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -left-[280px] top-[1900px] size-[650px] rounded-full bg-purple-5/40"
      />

      <PawPrint
        size={190}
        weight="fill"
        aria-hidden
        className="pointer-events-none absolute -right-[40px] top-[1350px] rotate-[20deg] text-purple-4/10"
      />

      <PawPrint
        size={150}
        weight="fill"
        aria-hidden
        className="pointer-events-none absolute -left-[30px] top-[2500px] -rotate-[15deg] text-purple-4/10"
      />

      {/* OUTER WRAPPER */}
      <div className="relative mx-auto w-full max-w-[1240px] px-[20px] py-[45px] md:px-[40px]">
        <Link
          href="/adoption"
          className="mb-[25px] inline-flex items-center gap-[8px] text-small-14 font-bold uppercase tracking-[0.08em] text-purple-3 transition-opacity hover:opacity-60"
        >
          <ArrowLeft size={18} />
          Back to Adoption List
        </Link>

        {/* MAGAZINE PAGE */}
        <article className="mx-auto max-w-[1100px] overflow-hidden border border-purple-4/30 bg-white shadow-[0_25px_80px_rgba(75,35,110,0.14)]">
          {/* MASTHEAD */}
          <header className="border-b border-purple-4/40 px-[28px] py-[18px] md:px-[55px]">
            <div className="flex flex-wrap items-center justify-between gap-[10px]">
              <p className="text-desc-12 font-bold uppercase tracking-[0.22em] text-purple-3">
                Helpet Adoption Journal
              </p>

              <p className="text-desc-12 font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Adoption Profile • {pet.city}
              </p>
            </div>
          </header>

          {/* HERO */}
          <section className="relative overflow-hidden bg-[#F8F1FF] px-[28px] pb-[65px] pt-[50px] md:px-[55px] md:pb-[75px] md:pt-[60px]">
            {/* Paw decorations */}
            <PawPrint
              size={125}
              weight="fill"
              aria-hidden
              className="absolute -left-[30px] top-[55px] -rotate-[18deg] text-purple-4/30"
            />

            <PawPrint
              size={65}
              weight="fill"
              aria-hidden
              className="absolute left-[10px] top-[20px] rotate-[15deg] text-purple-4/25"
            />

            {/* Top-right lavender circle */}
            <div
              aria-hidden
              className="absolute -right-[105px] -top-[110px] size-[250px] rounded-full bg-purple-4/25"
            />

            {/*
              Softer bottom circles:
              larger + thinner + lighter so they fade into the next section
            */}
            <div
              aria-hidden
              className="absolute -bottom-[150px] -left-[120px] size-[280px] rounded-full border-[3px] border-purple-4/15"
            />

            <div
              aria-hidden
              className="absolute -bottom-[150px] -right-[120px] size-[280px] rounded-full border-[3px] border-purple-4/15"
            />

            {/* HERO TITLE */}
            <div className="relative z-10 text-center">
              <p className="text-desc-12 font-bold uppercase tracking-[0.22em] text-green-5">
                Looking for a forever home
              </p>

              <h1 className="mt-[9px] text-[46px] font-bold uppercase leading-none text-neutral-800 md:text-[62px]">
                {pet.name} {pet.type}
              </h1>

              <div className="mx-auto mt-[16px] h-[3px] w-[65px] bg-purple-3" />
            </div>

            {/* PET + SNAPSHOT */}
            <div className="relative z-10 mt-[40px] grid items-center gap-[50px] lg:grid-cols-[0.9fr_1.1fr]">
              {/* PET IMAGE */}
              <div className="relative mx-auto flex min-h-[420px] w-full max-w-[440px] items-end justify-center">
                <img
                  src={pet.photo}
                  alt={`${pet.name} for adoption`}
                  className="relative z-10 max-h-[420px] max-w-full object-contain drop-shadow-[0_18px_18px_rgba(60,30,90,0.13)]"
                />

                <span className="absolute bottom-[5px] right-[5px] z-20 bg-green-5 px-[15px] py-[7px] text-desc-12 font-bold uppercase tracking-[0.08em] text-white">
                  {pet.type} • Adoption
                </span>
              </div>

              {/* ADOPTION SNAPSHOT */}
              <div>
                <p className="text-desc-12 font-bold uppercase tracking-[0.18em] text-green-5">
                  Adoption Snapshot
                </p>

                <h2 className="mt-[7px] text-[28px] font-bold uppercase text-purple-3">
                  Meet {pet.name}
                </h2>

                <div className="mt-[22px] grid gap-x-[35px] gap-y-[20px] sm:grid-cols-2">
                  <SnapshotItem label="Breed" value={pet.breed} />
                  <SnapshotItem label="Age" value={pet.age} />
                  <SnapshotItem label="Pet Type" value={pet.type} />
                  <SnapshotItem label="City" value={pet.city} />

                  <SnapshotItem
                    label="Vaccinated"
                    value={pet.vaccinated ? "Yes" : "No"}
                  />

                  <SnapshotItem
                    label="Status"
                    value="Available for Adoption"
                  />
                </div>

                <div className="mt-[28px] border-t border-purple-4/50 pt-[22px]">
                  <p className="text-desc-12 font-bold uppercase tracking-[0.14em] text-neutral-500">
                    About
                  </p>

                  <p className="mt-[8px] text-content-18 leading-[28px] text-neutral-700">
                    {pet.description}
                  </p>
                </div>

                <a
                  href={`tel:${pet.phone.replace(/\s/g, "")}`}
                  className="btn-primary mt-[28px]"
                >
                  <Phone size={18} weight="bold" />
                  Contact Publisher
                </a>
              </div>
            </div>
          </section>

          {/* SIDEBAR + PET PROFILE */}
          <div className="grid items-stretch lg:grid-cols-[230px_1fr]">
            {/* SIDEBAR */}
            <aside className="flex h-full flex-col border-b border-purple-4/40 bg-purple-5/45 lg:border-b-0 lg:border-r">
              <div className="px-[22px] py-[30px]">
                <p className="mb-[18px] text-desc-12 font-bold uppercase tracking-[0.18em] text-purple-3">
                  In this profile
                </p>

                <nav className="flex flex-col">
                  <SideLink href="#profile">Pet Profile</SideLink>
                  <SideLink href="#health">Health & Wellness</SideLink>
                  <SideLink href="#behavior">
                    Behavior & Temperament
                  </SideLink>
                  <SideLink href="#care">Daily Life & Care</SideLink>
                  <SideLink href="#story">Their Story</SideLink>
                  <SideLink href="#documents">Documents</SideLink>
                </nav>
              </div>

              {/* LISTING DETAILS */}
              <div className="flex-1 border-t border-purple-4/40 px-[22px] py-[28px]">
                <div className="flex items-center gap-[8px]">
                  <span className="flex size-[34px] items-center justify-center rounded-full bg-purple-3 text-white">
                    <PawPrint size={17} weight="fill" />
                  </span>

                  <div>
                    <p className="text-small-14 font-bold text-purple-3">
                      Listing Details
                    </p>

                    <p className="text-desc-12 text-neutral-500">
                      Adoption information
                    </p>
                  </div>
                </div>

                <div className="mt-[22px] flex flex-col gap-[14px]">
                  <SidebarInfo label="Status" value="Available" />
                  <SidebarInfo label="Location" value={pet.city} />
                  <SidebarInfo label="Pet Type" value={pet.type} />

                  <SidebarInfo
                    label="Vaccinated"
                    value={pet.vaccinated ? "Yes" : "No"}
                  />
                </div>

                
              </div>
            </aside>

            {/* PET PROFILE */}
            <div>
              <MagazineArticleSection
                id="profile"
                eyebrow="At a glance"
                title="Pet Profile"
                intro={`The essential information to know about ${pet.name}.`}
              >
                <div className="grid gap-x-[45px] gap-y-[32px] sm:grid-cols-2">
                  <InfoBlock label="Name" value={pet.name} />
                  <InfoBlock label="Age" value={pet.age} />
                  <InfoBlock label="Sex" value="—" />
                  <InfoBlock label="Breed" value={pet.breed} />
                  <InfoBlock label="Color" value="—" />
                  <InfoBlock label="City" value={pet.city} />
                </div>
              </MagazineArticleSection>
            </div>
          </div>

          {/* ADDITIONAL INFORMATION */}
          <section className="relative overflow-hidden bg-purple-5 px-[32px] py-[60px] md:px-[55px] md:py-[70px]">
            <PawPrint
              size={160}
              weight="fill"
              aria-hidden
              className="absolute -right-[30px] -top-[30px] rotate-[20deg] text-purple-4/35"
            />

            <PawPrint
              size={95}
              weight="fill"
              aria-hidden
              className="absolute -bottom-[20px] -left-[18px] -rotate-[15deg] text-purple-4/35"
            />

            <div className="relative z-10 max-w-[700px]">
              <p className="text-desc-12 font-bold uppercase tracking-[0.18em] text-green-5">
                Beyond the basics
              </p>

              <h2 className="mt-[7px] text-[32px] font-bold uppercase leading-[38px] text-purple-3 md:text-[38px]">
                Additional Information
              </h2>

              <div className="mt-[14px] h-[3px] w-[65px] bg-green-5" />

              <p className="mt-[18px] text-content-18 font-semibold leading-[28px] text-neutral-700">
                Health, personality, daily care and background details can help
                you understand whether {pet.name} could be the right match for
                your home.
              </p>
            </div>
          </section>

          {/* HEALTH */}
          <MagazineArticleSection
            id="health"
            eyebrow="Health overview"
            title="Health & Wellness"
            intro={`A closer look at ${pet.name}'s current health and medical information.`}
          >
            <div className="grid gap-[25px] md:grid-cols-2">
              <div className="border-l-[4px] border-green-5 bg-purple-5/50 p-[26px]">
                <p className="text-desc-12 font-bold uppercase tracking-[0.13em] text-neutral-500">
                  Vaccination Status
                </p>

                <p className="mt-[8px] text-[24px] font-bold uppercase text-purple-3">
                  {pet.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                </p>
              </div>

              <div className="border-l-[4px] border-purple-3 bg-white p-[26px]">
                <p className="text-desc-12 font-bold uppercase tracking-[0.13em] text-neutral-500">
                  Health Condition
                </p>

                <p className="mt-[8px] text-content-18 font-bold leading-[26px] text-purple-3">
                  {pet.health}
                </p>
              </div>
            </div>

            <div className="mt-[42px] grid gap-x-[55px] gap-y-[32px] sm:grid-cols-2 lg:grid-cols-4">
              <InfoBlock label="Spayed / Neutered" value="—" />
              <InfoBlock label="Medications" value="—" />
              <InfoBlock label="FIV / FeLV Test" value="—" />
              <InfoBlock label="Medical Records" value="—" />
            </div>
          </MagazineArticleSection>

          <MagazineDivider />

          {/* BEHAVIOR */}
          <MagazineArticleSection
            id="behavior"
            eyebrow="Personality"
            title="Behavior & Temperament"
            intro="Understanding social behavior can help make the transition into a new home easier for everyone."
          >
            <div className="grid gap-x-[55px] gap-y-[35px] sm:grid-cols-2 lg:grid-cols-3">
              <InfoBlock label="Personality" value="—" />
              <InfoBlock label="Good with Cats" value="—" />
              <InfoBlock label="Good with Dogs" value="—" />
              <InfoBlock label="Good with Children" value="—" />
              <InfoBlock label="Aggressive Behavior" value="—" />
              <InfoBlock label="Litter Trained" value="—" />
            </div>
          </MagazineArticleSection>

          {/* DAILY CARE */}
          <section
            id="care"
            className="scroll-mt-[30px] bg-purple-5/30 px-[32px] py-[70px] md:px-[55px] md:py-[80px]"
          >
            <div className="grid items-start gap-[55px] lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-desc-12 font-bold uppercase tracking-[0.18em] text-green-5">
                  Everyday routine
                </p>

                <h2 className="mt-[7px] text-[32px] font-bold uppercase leading-[39px] text-purple-3 md:text-[38px]">
                  Daily Life
                  <br />
                  & Care
                </h2>

                <div className="mt-[15px] h-[3px] w-[65px] bg-green-5" />

                <p className="mt-[18px] max-w-[400px] text-content-18 leading-[28px] text-neutral-600">
                  Food, living environment and special care can all play an
                  important role in helping a pet settle comfortably.
                </p>
              </div>

              <div className="grid gap-x-[45px] gap-y-[35px] sm:grid-cols-2">
                <InfoBlock label="Current Food" value="—" />
                <InfoBlock label="Indoor / Outdoor" value="—" />

                <div className="sm:col-span-2">
                  <InfoBlock label="Special Needs" value="—" />
                </div>
              </div>
            </div>
          </section>

          {/* THEIR STORY */}
          <section
            id="story"
            className="relative scroll-mt-[30px] overflow-hidden px-[32px] py-[75px] md:px-[55px] md:py-[90px]"
          >
            <PawPrint
              size={140}
              weight="fill"
              aria-hidden
              className="absolute -right-[25px] bottom-[-30px] rotate-[20deg] text-purple-5"
            />

            <div className="relative z-10 text-center">
              <p className="text-desc-12 font-bold uppercase tracking-[0.18em] text-green-5">
                Before today
              </p>

              <h2 className="mt-[7px] text-[34px] font-bold uppercase text-purple-3 md:text-[42px]">
                Their Story
              </h2>

              <p className="mx-auto mt-[12px] max-w-[570px] text-content-18 leading-[28px] text-neutral-500">
                Where they came from and why they&apos;re looking for a new
                place to call home.
              </p>

              <div className="mx-auto mt-[15px] h-[3px] w-[65px] bg-green-5" />
            </div>

            <div className="relative z-10 mt-[48px] grid gap-[45px] md:grid-cols-2">
              <StoryBlock label="Background" value="—" />
              <StoryBlock label="Reason for Adoption" value="—" />
            </div>
          </section>

          {/* FEATURE BANNER */}
          <section className="relative mx-[32px] my-[25px] overflow-hidden bg-purple-3 px-[35px] py-[55px] md:mx-[55px] md:px-[55px] md:py-[65px]">
            <PawPrint
              size={185}
              weight="fill"
              aria-hidden
              className="absolute -right-[40px] -top-[50px] rotate-[20deg] text-white/5"
            />

            <PawPrint
              size={60}
              weight="fill"
              aria-hidden
              className="absolute bottom-[22px] right-[40px] -rotate-[20deg] text-purple-2/40"
            />

            <div className="relative z-10">
              <p className="text-desc-12 font-bold uppercase tracking-[0.2em] text-purple-4">
                Helpet Adoption Journal
              </p>

              <h2 className="mt-[10px] max-w-[700px] text-[34px] font-bold uppercase leading-[42px] text-white md:text-[48px] md:leading-[54px]">
                Every pet deserves
                <br />
                a <span className="text-green-5">second chapter.</span>
              </h2>

              <p className="mt-[18px] max-w-[540px] text-content-18 leading-[28px] text-white/75">
                A loving home can change an entire life. Learn their story,
                understand their needs and make a thoughtful match.
              </p>
            </div>
          </section>

          {/* DOCUMENTS */}
          <section
            id="documents"
            className="scroll-mt-[30px] px-[32px] py-[75px] md:px-[55px] md:py-[90px]"
          >
            <div className="max-w-[700px]">
              <p className="text-desc-12 font-bold uppercase tracking-[0.18em] text-green-5">
                Records
              </p>

              <h2 className="mt-[7px] text-[32px] font-bold uppercase leading-[38px] text-purple-3 md:text-[38px]">
                Documents
              </h2>

              <p className="mt-[10px] text-content-18 leading-[27px] text-neutral-500">
                Health and vaccination records provided with this adoption
                listing.
              </p>

              <div className="mt-[15px] h-[3px] w-[65px] bg-green-5" />
            </div>

            <div className="mt-[42px] grid gap-[25px] md:grid-cols-2">
              <DocumentCard
                title="Vaccination Record"
                description="Vaccination history and related records."
              />

              <DocumentCard
                title="Medical Records"
                description="Medical reports, checkups and health records."
              />
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="relative overflow-hidden bg-purple-5/80 px-[32px] py-[70px] text-center md:px-[55px] md:py-[85px]">
            <PawPrint
              size={100}
              weight="fill"
              aria-hidden
              className="absolute -left-[20px] bottom-[-15px] rotate-[25deg] text-purple-4/30"
            />

            <PawPrint
              size={65}
              weight="fill"
              aria-hidden
              className="absolute right-[35px] top-[20px] -rotate-[20deg] text-purple-4/30"
            />

            <div className="relative z-10">
              <p className="text-desc-12 font-bold uppercase tracking-[0.22em] text-green-5">
                Ready for the next step?
              </p>

              <h2 className="mt-[10px] text-[36px] font-bold uppercase text-purple-3 md:text-[42px]">
                Interested in {pet.name}?
              </h2>

              <p className="mx-auto mt-[12px] max-w-[540px] text-content-18 leading-[28px] text-neutral-600">
                Contact the publisher directly to learn more and see whether
                your home could be the right fit for {pet.name}.
              </p>

              <a
                href={`tel:${pet.phone.replace(/\s/g, "")}`}
                className="btn-primary mt-[28px]"
              >
                <Phone size={18} weight="bold" />
                Contact Publisher
              </a>

              <div className="mt-[25px]">
                <Link
                  href="/adoption"
                  className="text-small-14 font-bold text-purple-3 hover:underline"
                >
                  ← Back to Adoption List
                </Link>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-purple-4/30 px-[28px] py-[18px] text-center md:px-[55px]">
            <p className="text-desc-12 font-bold uppercase tracking-[0.18em] text-purple-3">
              Helpet • Adoption Journal
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}

/* REUSABLE COMPONENTS */

function SideLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="border-b border-purple-4/40 py-[10px] text-small-14 font-semibold text-neutral-600 transition-all hover:pl-[5px] hover:text-purple-3"
    >
      {children}
    </a>
  );
}

function SidebarInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-desc-12 font-semibold uppercase tracking-[0.1em] text-neutral-500">
        {label}
      </p>

      <p className="mt-[3px] text-small-14 font-bold text-purple-3">
        {value}
      </p>
    </div>
  );
}

function SnapshotItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-desc-12 font-bold uppercase tracking-[0.11em] text-neutral-500">
        {label}
      </p>

      <p className="mt-[5px] text-content-18 font-bold text-purple-3">
        {value}
      </p>
    </div>
  );
}

function MagazineArticleSection({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-[30px] px-[32px] py-[70px] md:px-[55px] md:py-[80px]"
    >
      <div className="max-w-[700px]">
        <p className="text-desc-12 font-bold uppercase tracking-[0.18em] text-green-5">
          {eyebrow}
        </p>

        <h2 className="mt-[7px] text-[32px] font-bold uppercase leading-[38px] text-purple-3 md:text-[38px]">
          {title}
        </h2>

        {intro && (
          <p className="mt-[10px] text-content-18 leading-[27px] text-neutral-500">
            {intro}
          </p>
        )}

        <div className="mt-[15px] h-[3px] w-[65px] bg-green-5" />
      </div>

      <div className="mt-[42px]">{children}</div>
    </section>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-desc-12 font-bold uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </p>

      <p className="mt-[6px] text-content-18 font-bold leading-[25px] text-purple-3">
        {value}
      </p>
    </div>
  );
}

function StoryBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t-[3px] border-green-5 pt-[17px]">
      <p className="text-desc-12 font-bold uppercase tracking-[0.13em] text-neutral-500">
        {label}
      </p>

      <p className="mt-[10px] text-content-18 font-bold leading-[27px] text-purple-3">
        {value}
      </p>
    </div>
  );
}

function MagazineDivider() {
  return (
    <div className="flex items-center gap-[15px] px-[32px] md:px-[55px]">
      <span className="h-px flex-1 bg-purple-4/50" />

      <PawPrint
        size={24}
        weight="fill"
        className="rotate-[15deg] text-purple-4"
      />

      <span className="h-px flex-1 bg-purple-4/50" />
    </div>
  );
}

function DocumentCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="group border border-purple-4/50 bg-purple-5/25 p-[25px] transition-all duration-300 hover:border-purple-3 hover:bg-purple-5/50">
      <div className="flex items-start gap-[15px]">
        <span className="flex size-[48px] shrink-0 items-center justify-center bg-purple-3 text-white">
          <FileText size={23} weight="bold" />
        </span>

        <div>
          <h3 className="text-content-18 font-bold text-purple-3">
            {title}
          </h3>

          <p className="mt-[5px] text-small-14 leading-[20px] text-neutral-600">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-[25px] border-t border-purple-4/40 pt-[15px]">
        <p className="text-small-14 font-bold text-neutral-400">
          Not provided
        </p>
      </div>
    </div>
  );
}