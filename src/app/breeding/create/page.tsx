"use client";

import FormShell, { FormSection } from "@/components/forms/FormShell";
import {
  Field,
  PhotoUpload,
  SelectField,
  TextareaField,
} from "@/components/ui/fields";
import { CITIES, PET_TYPES } from "@/data/content";

export default function CreateBreedingRequestPage() {
  return (
    <FormShell
      steps={["Pet Details", "Contact", "Published"]}
      title="Create a Breeding Request"
      banner={
        <>
          <span className="font-bold">Health first.</span> Requests that include
          age, gender and health details attract serious, responsible owners —
          and are prioritized in search results.
        </>
      }
      side={{
        title: "Request Summary",
        tips: [
          "Include registration or pedigree details if available.",
          "Mention health tests (vaccines, genetic screening).",
          "Be clear about your expectations and conditions.",
          "You can edit or close the request from My Account.",
        ],
        submitLabel: "Publish Request",
      }}
      success={{
        message:
          "Your breeding request is live! Owners with matching pets will contact you directly on the number you provided.",
        backHref: "/breeding",
        backLabel: "Back to Breeding Requests",
      }}
    >
      <FormSection title="Pet Information">
        <PhotoUpload label="Pet Photo" />
        <div className="grid grid-cols-1 gap-[25px] sm:grid-cols-2">
          <SelectField label="Type" options={PET_TYPES} placeholder="Select type" />
          <Field label="Breed" placeholder="e.g. Chihuahua" required />
          <Field label="Age" placeholder="e.g. 3 years" />
          <SelectField label="Gender" options={["Female", "Male"]} placeholder="Select gender" />
          <SelectField label="City" options={CITIES} placeholder="Select city" />
        </div>
        <TextareaField
          label="Description"
          placeholder="Pedigree, health tests, temperament, what you're looking for in a match…"
          rows={4}
        />
      </FormSection>

      <FormSection title="Contact Information">
        <div className="grid grid-cols-1 gap-[25px] sm:grid-cols-2">
          <Field label="Phone" placeholder="+966 5X XXX XXXX" type="tel" required />
        </div>
      </FormSection>
    </FormShell>
  );
}
