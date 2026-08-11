"use client";

import FormShell, { FormSection } from "@/components/forms/FormShell";
import { useState } from "react";
import Link from "next/link";
import {
  Field,
  PhotoUpload,
  SelectField,
  TextareaField,
} from "@/components/ui/fields";
import { CITIES, PET_TYPES } from "@/data/content";

export default function PublishAdoptionPage() {
  const [form, setForm] = useState({
  name: "",
  type: "",
  breed: "",
  age: "",
  vaccination: "",
  city: "",
  health: "",
  description: "",
  phone: "",
});

const checklist = [
  form.name.trim() ? "✓ Pet name added" : "Missing: Pet name",
  form.type ? "✓ Pet type selected" : "Missing: Pet type",
  form.breed.trim() ? "✓ Breed added" : "Missing: Breed",
  form.age.trim() ? "✓ Age added" : "Missing: Age",
  form.vaccination
    ? "✓ Vaccination status selected"
    : "Missing: Vaccination status",
  form.city ? "✓ City selected" : "Missing: City",
  form.health.trim()
    ? "✓ Health condition added"
    : "Missing: Health condition",
  form.description.trim()
    ? "✓ Description added"
    : "Missing: Description",
  form.phone.length === 9
    ? "✓ Phone number completed"
    : "Missing: Valid 9-digit phone number",
];
  return (
    <FormShell
      steps={["Pet Details", "Health & Contact", "Published"]}
      title="Publish an Adoption Listing"
      banner={
        <>
          <span className="font-bold">Honest listings find homes faster.</span>{" "}
          Complete health and vaccination details build trust — listings with
          full information receive{" "}
          <span className="font-bold text-purple-3">twice as many</span>{" "}
          serious inquiries.
        </>
      }
      side={{
        title: "Listing Summary",
        tips: checklist,
        submitLabel: "Publish Listing",
      }}
      success={{
        message:
          "Your adoption listing is live! Interested adopters will call you directly. Manage the listing anytime from My Account.",
        backHref: "/adoption",
        backLabel: "Back to Adoption",
      }}
    >
       <Link
    href="/adoption"
    className="inline-flex w-fit items-center gap-[6px] font-semibold text-purple-3 hover:opacity-70"
  >
    ← Back to Adoption List
  </Link>
      <FormSection title="Pet Information">
        <div className="adoption-publish-fields">
        
        <PhotoUpload label="Pet Photo" />
        <div className="mt-[20px] grid grid-cols-1 gap-[25px] sm:grid-cols-2">
          <Field label="Name" placeholder="e.g. Bruno" required  value={form.name}
  onChange={(value) =>
    setForm((prev) => ({ ...prev, name: value }))
  } />
          <SelectField label="Type" options={PET_TYPES} value={form.type}
  onChange={(value) =>
    setForm((prev) => ({ ...prev, type: value }))
  } />
          <Field label="Breed" placeholder="e.g. Pug" required value={form.breed}
  onChange={(value) =>
    setForm((prev) => ({ ...prev, breed: value }))
  } />
          <Field label="Age" placeholder="e.g. 2 years" value={form.age}
  onChange={(value) =>
    setForm((prev) => ({ ...prev, age: value }))
  } />
          <SelectField
            label="Vaccination Status"
            options={["Vaccinated", "Not vaccinated"]}
            placeholder="Select status"
            value={form.vaccination}
  onChange={(value) =>
    setForm((prev) => ({ ...prev, vaccination: value }))
  }
          />
          <SelectField label="City" options={CITIES} placeholder="Select city" value={form.city}
  onChange={(value) =>
    setForm((prev) => ({ ...prev, city: value }))
  } />
        </div>
        <Field
          label="Health Condition"
          placeholder="e.g. Excellent — neutered, full checkup done" value={form.health}
  onChange={(value) =>
    setForm((prev) => ({ ...prev, health: value }))
  }
          className="mt-[20px]"
        />
        <TextareaField
          label="Description"
          placeholder="Personality, habits, what kind of home would suit this pet…"
          rows={4}
          value={form.description}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, description: value }))
          }
          className="mt-[20px]"
        />
        </div>
      </FormSection>

      <FormSection title="Contact Information">
        <div className="adoption-publish-fields">
         <div className="grid grid-cols-1 gap-[25px] sm:grid-cols-2">
<label className="field flex flex-col gap-[8px]">
  <span className="field-label static ml-[5px] bg-transparent px-0">
    Phone
  </span>

  <div className="flex">
    <span className="flex items-center rounded-l-btn border border-r-0 border-neutral-200 bg-purple-5 px-[16px] text-content-18 font-semibold text-purple-3">
      +966
    </span>

    <input
      type="tel"
      name="phone"
      required
      placeholder="5X XXX XXXX"
       maxLength={9}
       pattern="[0-9]{9}"
      inputMode="numeric"
      value={form.phone}
onChange={(e) => {
  const numbersOnly = e.target.value.replace(/\D/g, "");
  setForm((prev) => ({
    ...prev,
    phone: numbersOnly,
  }));
}}
      className="field-input rounded-l-none"
    />
  </div>
</label>
          </div>
        </div>
      </FormSection>
    </FormShell>
  );
}
