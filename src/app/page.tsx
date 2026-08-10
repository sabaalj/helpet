import Hero from "@/components/sections/Hero";
import LostFoundPreview from "@/components/sections/LostFoundPreview";
import AdoptionPreview from "@/components/sections/AdoptionPreview";
import BreedingPreview from "@/components/sections/BreedingPreview";
import AccountPreview from "@/components/sections/AccountPreview";
import PetNews from "@/components/sections/PetNews";
import PetFacts from "@/components/sections/PetFacts";
import StatsBand from "@/components/sections/StatsBand";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LostFoundPreview />
      <AdoptionPreview />
      <BreedingPreview />
      <AccountPreview />
      <PetNews />
      <PetFacts />
      <StatsBand />
      <Testimonials />
      <FAQ />
    </>
  );
}
