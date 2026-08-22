"use client";

import FormShell, { FormSection } from "@/components/forms/FormShell";
import {
  Field,
  PhotoUpload,
  SelectField,
  TextareaField,
} from "@/components/ui/fields";
import { CITIES, PET_TYPES } from "@/data/content";

export default function ReportLostPetPage() {
  return (
    <FormShell
      className="form-modern"
      steps={["Pet Details", "Contact Info", "Published"]}
      title="Report a Lost Pet"
      banner={
        <>
          <span className="font-bold">Every minute counts.</span> Reports with a
          clear photo and a precise last-seen location are found{" "}
          <span className="font-bold text-purple-3">3× faster</span>. Your
          report goes live immediately after publishing.
        </>
      }
      side={{
        title: "Report Summary",
        tips: [
          "Use a recent, well-lit photo where the face and colors are clear.",
          "Mention collars, tags, microchips or distinctive marks.",
          "Add two phone numbers so finders always reach someone.",
          "Update the status from My Account once your pet is home.",
        ],
        submitLabel: "Publish Report",
      }}
      success={{
        message:
          "Your lost pet report is live. We've notified pet lovers in your city — keep your phone close and check My Account for updates.",
        backHref: "/lost-found",
        backLabel: "Back to Lost & Found",
      }}
    >
      <FormSection title="Pet Information">
        <PhotoUpload label="Pet Photo" />
        <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2">
          <Field label="Name" placeholder="e.g. Luna" required />
          <SelectField label="Type" options={PET_TYPES} placeholder="Select type" />
          <Field label="Breed" placeholder="e.g. Chihuahua" required />
          <Field label="Age" placeholder="e.g. 2 years" />
          <SelectField label="Gender" options={["Female", "Male"]} placeholder="Select gender" />
          <SelectField label="City" options={CITIES} placeholder="Select city" />
        </div>
        <Field
          label="Last Seen Location"
          placeholder="e.g. Al Olaya district, near the park gate"
          required
        />
        <TextareaField
          label="Description"
          placeholder="Collar, markings, behavior, anything that helps identify your pet…"
          rows={4}
        />
      </FormSection>

      <FormSection title="Contact Information">
        <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2">
          <Field label="Primary Phone" placeholder="+966 5X XXX XXXX" type="tel" required />
          <Field label="Secondary Phone" placeholder="+966 5X XXX XXXX" type="tel" />
        </div>
      </FormSection>
    </FormShell>
  );
}
