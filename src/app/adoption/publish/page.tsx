"use client";

import FormShell, { FormSection } from "@/components/forms/FormShell";
import { useState } from "react";
import Link from "next/link";
import {
  DocumentUpload,
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

    sex: "",
    color: "",
    spayedNeutered: "",
    medications: "",
    medicationDetails: "",
    fivFelvTest: "",
    personality: "",
    goodWithCats: "",
    goodWithDogs: "",
    goodWithChildren: "",
    aggressiveBehavior: "",
    litterTrained: "",
    currentFood: "",
    indoorOutdoor: "",
    specialNeeds: "",
    specialNeedsDetails: "",
    background: "",
    adoptionReason: "",
  });

  const [, setVaccinationRecord] = useState<File | null>(null);
  const [, setMedicalRecord] = useState<File | null>(null);

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
            <Field
              label="Name"
              placeholder="e.g. Bruno"
              required
              value={form.name}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, name: value }))
              }
            />

            <SelectField
              label="Type"
              options={PET_TYPES}
              value={form.type}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, type: value }))
              }
            />

            <Field
              label="Breed"
              placeholder="e.g. Pug"
              required
              value={form.breed}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, breed: value }))
              }
            />

            <Field
              label="Age"
              placeholder="e.g. 2 years"
              value={form.age}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, age: value }))
              }
            />

            <SelectField
              label="Vaccination Status"
              options={["Vaccinated", "Not vaccinated"]}
              placeholder="Select status"
              value={form.vaccination}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, vaccination: value }))
              }
            />

            <SelectField
              label="City"
              options={CITIES}
              placeholder="Select city"
              value={form.city}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, city: value }))
              }
            />
          </div>

          <Field
            label="Health Condition"
            placeholder="e.g. Excellent — neutered, full checkup done"
            value={form.health}
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

      <FormSection title="Additional Details">
        <div className="adoption-publish-fields">
          <p className="text-content-10 font-bold leading-[24px] text-purple-3">
            Add more information to help adopters understand your pet better.
            These details will appear on the full adoption details page.
          </p>

          {/* Basic additional details */}
          <div className="grid grid-cols-1 gap-[25px] sm:grid-cols-2">
            <SelectField
              label="Sex"
              options={["Male", "Female"]}
              placeholder="Select sex"
              value={form.sex}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, sex: value }))
              }
            />

            <Field
              label="Color"
              placeholder="e.g. White & gray"
              value={form.color}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, color: value }))
              }
            />

            <SelectField
              label="Spayed / Neutered"
              options={["Yes", "No"]}
              placeholder="Select status"
              value={form.spayedNeutered}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, spayedNeutered: value }))
              }
            />

            <SelectField
              label="FIV / FeLV Test"
              options={["Negative", "Positive", "Not tested"]}
              placeholder="Select result"
              value={form.fivFelvTest}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, fivFelvTest: value }))
              }
            />
          </div>

          {/* Medications */}
          <div className="mt-[20px]">
            <SelectField
              label="Medications"
              options={["No", "Yes"]}
              placeholder="Select"
              value={form.medications}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  medications: value,
                  medicationDetails:
                    value === "Yes" ? prev.medicationDetails : "",
                }))
              }
            />

            {form.medications === "Yes" && (
              <TextareaField
                label="Medication Details"
                placeholder="List medications, dosage, or any important instructions..."
                rows={3}
                className="mt-[20px]"
                value={form.medicationDetails}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    medicationDetails: value,
                  }))
                }
              />
            )}
          </div>

          {/* Documents */}
          <h3 className="mt-[30px] text-title-20 font-bold text-purple-3">
            Documents
          </h3>

          <p className="mt-[5px] text-small-14 leading-[20px] text-neutral-600">
            Upload available health records to help adopters verify important
            medical information.
          </p>

          <div className="mt-[25px] grid grid-cols-1 gap-[25px] sm:grid-cols-2">
            <DocumentUpload
              label="Vaccination Record"
              onChange={setVaccinationRecord}
            />

            <DocumentUpload
              label="Medical Records"
              onChange={setMedicalRecord}
            />
          </div>

          {/* Behavior */}
          <h3 className="mt-[30px] text-title-20 font-bold text-purple-3">
            Behavior
          </h3>

          <TextareaField
            label="Personality"
            placeholder="e.g. Friendly, playful, calm, shy..."
            rows={3}
            className="mt-[20px]"
            value={form.personality}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, personality: value }))
            }
          />

          <div className="mt-[20px] grid grid-cols-1 gap-[25px] sm:grid-cols-2">
            <SelectField
              label="Good with Cats"
              options={["Yes", "No", "Unknown"]}
              placeholder="Select"
              value={form.goodWithCats}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, goodWithCats: value }))
              }
            />

            <SelectField
              label="Good with Dogs"
              options={["Yes", "No", "Unknown"]}
              placeholder="Select"
              value={form.goodWithDogs}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, goodWithDogs: value }))
              }
            />

            <SelectField
              label="Good with Children"
              options={["Yes", "No", "Unknown"]}
              placeholder="Select"
              value={form.goodWithChildren}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  goodWithChildren: value,
                }))
              }
            />

            <SelectField
              label="Aggressive Behavior"
              options={["No", "Yes", "Unknown"]}
              placeholder="Select"
              value={form.aggressiveBehavior}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  aggressiveBehavior: value,
                }))
              }
            />

            <SelectField
              label="Litter Trained"
              options={["Yes", "No", "Not applicable"]}
              placeholder="Select"
              value={form.litterTrained}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, litterTrained: value }))
              }
            />
          </div>

          {/* Care */}
          <h3 className="mt-[30px] text-title-20 font-bold text-purple-3">
            Care
          </h3>

          <div className="mt-[20px] grid grid-cols-1 gap-[25px] sm:grid-cols-2">
            <Field
              label="Current Food"
              placeholder="e.g. Dry + wet food"
              value={form.currentFood}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, currentFood: value }))
              }
            />

            <SelectField
              label="Indoor / Outdoor"
              options={["Indoor", "Outdoor", "Both"]}
              placeholder="Select"
              value={form.indoorOutdoor}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, indoorOutdoor: value }))
              }
            />
          </div>

          {/* Special Needs */}
          <div className="mt-[20px]">
            <SelectField
              label="Special Needs"
              options={["No", "Yes"]}
              placeholder="Select"
              value={form.specialNeeds}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  specialNeeds: value,
                  specialNeedsDetails:
                    value === "Yes" ? prev.specialNeedsDetails : "",
                }))
              }
            />

            {form.specialNeeds === "Yes" && (
              <TextareaField
                label="Special Needs Details"
                placeholder="Describe any special care, diet, mobility, or other needs..."
                rows={3}
                className="mt-[20px]"
                value={form.specialNeedsDetails}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    specialNeedsDetails: value,
                  }))
                }
              />
            )}
          </div>

          {/* History */}
          <h3 className="mt-[30px] text-title-20 font-bold text-purple-3">
            History
          </h3>

          <TextareaField
            label="Background"
            placeholder="e.g. Rescued as a kitten..."
            rows={3}
            className="mt-[20px]"
            value={form.background}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, background: value }))
            }
          />

          <TextareaField
            label="Reason for Adoption"
            placeholder="Explain why the pet is being offered for adoption..."
            rows={3}
            className="mt-[20px]"
            value={form.adoptionReason}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, adoptionReason: value }))
            }
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
