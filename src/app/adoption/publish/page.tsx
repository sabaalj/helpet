"use client";

import FormShell, { FormSection } from "@/components/forms/FormShell";
import {
  Field,
  PhotoUpload,
  SelectField,
  TextareaField,
} from "@/components/ui/fields";
import { CITIES, PET_TYPES } from "@/data/content";

export default function PublishAdoptionPage() {
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
        tips: [
          "Photograph your pet in daylight, at eye level.",
          "State vaccination status honestly — adopters always ask.",
          "Describe temperament: kids, other pets, energy level.",
          "You can pause or close the listing anytime from My Account.",
        ],
        submitLabel: "Publish Listing",
      }}
      success={{
        message:
          "Your adoption listing is live! Interested adopters will call you directly. Manage the listing anytime from My Account.",
        backHref: "/adoption",
        backLabel: "Back to Adoption",
      }}
    >
      <FormSection title="Pet Information">
        <PhotoUpload label="Pet Photo" />
        <div className="grid grid-cols-1 gap-[25px] sm:grid-cols-2">
          <Field label="Name" placeholder="e.g. Bruno" required />
          <SelectField label="Type" options={PET_TYPES} placeholder="Select type" />
          <Field label="Breed" placeholder="e.g. Pug" required />
          <Field label="Age" placeholder="e.g. 2 years" />
          <SelectField
            label="Vaccination Status"
            options={["Vaccinated", "Not vaccinated"]}
            placeholder="Select status"
          />
          <SelectField label="City" options={CITIES} placeholder="Select city" />
        </div>
        <Field
          label="Health Condition"
          placeholder="e.g. Excellent — neutered, full checkup done"
        />
        <TextareaField
          label="Description"
          placeholder="Personality, habits, what kind of home would suit this pet…"
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
