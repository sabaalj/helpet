/* ─────────────────────────────────────────────────────────────
   Helpet demo content.
   All photos reference original assets exported from the Figma
   file (downloaded by scripts/fetch-assets.mjs into /assets).
   ───────────────────────────────────────────────────────────── */

export const PET_TYPES = ["Dog", "Cat", "Hamster", "Bird"] as const;
export type PetType = (typeof PET_TYPES)[number];

export const CITIES = [
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Mecca",
  "Medina",
  "Khobar",
] as const;
export type City = (typeof CITIES)[number];

/* ── Lost & Found ─────────────────────────────────────────── */
export interface LostPet {
  id: string;
  photo: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
  gender: "Male" | "Female";
  lastSeen: string;
  city: City;
  description: string;
  phonePrimary: string;
  phoneSecondary: string;
}

export const LOST_PETS: LostPet[] = [
  {
    id: "lp-1",
    photo: "/assets/pet-1.png",
    name: "Luna",
    type: "Dog",
    breed: "Chihuahua",
    age: "2 years",
    gender: "Female",
    lastSeen: "Al Olaya district, near the park gate",
    city: "Riyadh",
    description:
      "Small tan chihuahua wearing a purple collar with a bell. Very shy around strangers but responds to her name.",
    phonePrimary: "+966 50 123 4567",
    phoneSecondary: "+966 55 765 4321",
  },
  {
    id: "lp-2",
    photo: "/assets/pet-2.png",
    name: "Max",
    type: "Dog",
    breed: "Dachshund",
    age: "4 years",
    gender: "Male",
    lastSeen: "Corniche walkway, north section",
    city: "Jeddah",
    description:
      "Black and tan dachshund, microchipped. Was last seen chasing seagulls near the fountain. Friendly and food-motivated.",
    phonePrimary: "+966 54 222 8899",
    phoneSecondary: "+966 50 998 1122",
  },
  {
    id: "lp-3",
    photo: "/assets/pet-3.png",
    name: "Snow",
    type: "Dog",
    breed: "Poodle",
    age: "3 years",
    gender: "Female",
    lastSeen: "King Fahd Road, near the mall parking",
    city: "Dammam",
    description:
      "White toy poodle with a recent haircut. Wearing a pink harness. Answers to 'Snow' and loves treats.",
    phonePrimary: "+966 56 444 7788",
    phoneSecondary: "+966 53 111 2233",
  },
  {
    id: "lp-4",
    photo: "/assets/pet-4.png",
    name: "Biscuit",
    type: "Dog",
    breed: "Pug",
    age: "5 years",
    gender: "Male",
    lastSeen: "Al Aziziyah district, street 12",
    city: "Mecca",
    description:
      "Fawn pug with a curly tail and black mask. Slightly overweight, walks slowly. Has a red collar with owner tag.",
    phonePrimary: "+966 59 333 6677",
    phoneSecondary: "+966 50 555 8844",
  },
  {
    id: "lp-5",
    photo: "/assets/hero-card-pet.png",
    name: "Mango",
    type: "Cat",
    breed: "Orange Tabby",
    age: "1 year",
    gender: "Male",
    lastSeen: "Rooftops around Quba Road",
    city: "Medina",
    description:
      "Playful orange tabby with white paws. Indoor cat that slipped out at night. Very vocal and comes to kissing sounds.",
    phonePrimary: "+966 58 777 1010",
    phoneSecondary: "+966 54 909 3030",
  },
  {
    id: "lp-6",
    photo: "/assets/pet-5.png",
    name: "Coco",
    type: "Bird",
    breed: "Cockatiel",
    age: "2 years",
    gender: "Female",
    lastSeen: "Al Ulaya, flew from balcony",
    city: "Khobar",
    description:
      "Grey cockatiel with yellow crest and orange cheeks. Whistles a short melody. May approach people offering seeds.",
    phonePrimary: "+966 55 606 4040",
    phoneSecondary: "+966 50 202 7070",
  },
];

/* ── Adoption ─────────────────────────────────────────────── */
export interface AdoptionPet {
  id: string;
  photo: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
  ageGroup: "Baby" | "Young" | "Adult" | "Senior";
  vaccinated: boolean;
  health: string;
  city: City;
  description: string;
  phone: string;
}

export const ADOPTION_PETS: AdoptionPet[] = [
  {
    id: "ap-1",
    photo: "/assets/pet-1.png",
    name: "Chiquita",
    type: "Dog",
    breed: "Chihuahua",
    age: "8 months",
    ageGroup: "Young",
    vaccinated: true,
    health: "Excellent — full checkup done",
    city: "Riyadh",
    description:
      "Tiny bundle of energy looking for a warm lap. Litter trained, great with kids, loves squeaky toys.",
    phone: "+966 50 123 9090",
  },
  {
    id: "ap-2",
    photo: "/assets/pet-2.png",
    name: "Oscar",
    type: "Dog",
    breed: "Dachshund",
    age: "3 years",
    ageGroup: "Adult",
    vaccinated: true,
    health: "Very good — minor allergy, managed",
    city: "Jeddah",
    description:
      "Calm and loyal wiener dog. Walks well on a leash and gets along with cats. Ideal for apartment living.",
    phone: "+966 54 787 2323",
  },
  {
    id: "ap-3",
    photo: "/assets/pet-3.png",
    name: "Fluffy",
    type: "Dog",
    breed: "Poodle",
    age: "5 years",
    ageGroup: "Adult",
    vaccinated: false,
    health: "Good — needs vaccination course",
    city: "Dammam",
    description:
      "Elegant white poodle surrendered by a traveling family. Knows basic commands and adores grooming sessions.",
    phone: "+966 56 454 5656",
  },
  {
    id: "ap-4",
    photo: "/assets/pet-4.png",
    name: "Bruno",
    type: "Dog",
    breed: "Pug",
    age: "2 years",
    ageGroup: "Young",
    vaccinated: true,
    health: "Excellent — neutered",
    city: "Riyadh",
    description:
      "Comedy on four legs. Snores like a tractor, cuddles like a champion. Perfect first dog for a chill household.",
    phone: "+966 59 313 8181",
  },
  {
    id: "ap-5",
    photo: "/assets/hero-card-pet.png",
    name: "Simba",
    type: "Cat",
    breed: "Orange Tabby",
    age: "6 months",
    ageGroup: "Baby",
    vaccinated: true,
    health: "Excellent — dewormed",
    city: "Khobar",
    description:
      "Curious kitten rescued from a parking lot. Uses the litter box, purrs instantly and chases anything that moves.",
    phone: "+966 55 616 7272",
  },
  {
    id: "ap-6",
    photo: "/assets/pet-5.png",
    name: "Kiwi",
    type: "Bird",
    breed: "Budgerigar",
    age: "1 year",
    ageGroup: "Young",
    vaccinated: false,
    health: "Good — wings clipped, healthy",
    city: "Medina",
    description:
      "Cheerful green budgie that mimics phone ringtones. Comes with cage and accessories to a loving home.",
    phone: "+966 58 848 9494",
  },
];

/* ── Breeding Requests ────────────────────────────────────── */
export interface BreedingRequest {
  id: string;
  photo: string;
  type: PetType;
  breed: string;
  age: string;
  gender: "Male" | "Female";
  city: City;
  description: string;
  phone: string;
}

export const BREEDING_REQUESTS: BreedingRequest[] = [
  {
    id: "br-1",
    photo: "/assets/pet-4.png",
    type: "Dog",
    breed: "Pug",
    age: "3 years",
    gender: "Male",
    city: "Riyadh",
    description:
      "Champion-line fawn pug, KC registered, health tested (BOAS grade 0). Looking for a registered female.",
    phone: "+966 50 111 5511",
  },
  {
    id: "br-2",
    photo: "/assets/pet-1.png",
    type: "Dog",
    breed: "Chihuahua",
    age: "2 years",
    gender: "Female",
    city: "Jeddah",
    description:
      "Apple-head chihuahua, 2.1 kg, first heat passed. Seeking a small, health-tested male with pedigree.",
    phone: "+966 54 232 6161",
  },
  {
    id: "br-3",
    photo: "/assets/hero-card-pet.png",
    type: "Cat",
    breed: "Orange Tabby",
    age: "2 years",
    gender: "Male",
    city: "Dammam",
    description:
      "Sweet-tempered tabby with striking markings. Vaccinated and FIV/FeLV negative. Open to experienced owners.",
    phone: "+966 56 505 7171",
  },
  {
    id: "br-4",
    photo: "/assets/pet-2.png",
    type: "Dog",
    breed: "Dachshund",
    age: "4 years",
    gender: "Male",
    city: "Khobar",
    description:
      "Standard smooth dachshund with excellent temperament. PRA clear, back x-rays perfect. Proven sire.",
    phone: "+966 59 424 8282",
  },
];

/* ── Pet News ─────────────────────────────────────────────── */
export interface NewsArticle {
  id: string;
  photo: string;
  date: string;
  title: string;
  excerpt: string;
  tag: string;
}

export const NEWS: NewsArticle[] = [
  {
    id: "n-1",
    photo: "/assets/photo-14.png",
    date: "02 Aug 2026",
    title: "The Tiny Dog With a Big Personality",
    excerpt:
      "Chihuahuas are one of the most recognizable dog breeds in the world. Let's explore the origins, behavior and defining traits of these adorable little companions.",
    tag: "Breeds",
  },
  {
    id: "n-2",
    photo: "/assets/photo-15.png",
    date: "28 Jul 2026",
    title: "Summer Heat: Keeping Your Pet Safe",
    excerpt:
      "High temperatures can be dangerous for pets. From hydration schedules to walk timing, here is everything you need to protect your furry friends this summer.",
    tag: "Care",
  },
  {
    id: "n-3",
    photo: "/assets/contact-cats.png",
    date: "21 Jul 2026",
    title: "Adoption Stories: From Street to Sofa",
    excerpt:
      "Three heart-warming stories from Helpet families who opened their homes — and what they learned in the first thirty days after adoption.",
    tag: "Community",
  },
];

/* ── Pet Facts (numbered, "What we offer" layout) ─────────── */
export const PET_FACTS = [
  {
    n: 1,
    title: "Powerful Noses",
    text: "A dog's sense of smell is up to 100,000 times stronger than a human's — that's why they find their way home.",
  },
  {
    n: 2,
    title: "Cat Naps",
    text: "Cats sleep 12–16 hours a day, spending roughly 70% of their lives napping and recharging.",
  },
  {
    n: 3,
    title: "Unique Prints",
    text: "A dog's nose print is as unique as a human fingerprint — no two are ever alike.",
  },
  {
    n: 4,
    title: "Bird Memory",
    text: "Parrots and cockatiels can learn dozens of melodies and even recognize their own names.",
  },
  {
    n: 5,
    title: "Happy Tails",
    text: "Dogs wag more to the right when happy and to the left when anxious — tails literally speak.",
  },
  {
    n: 6,
    title: "Whisker Radar",
    text: "Cat whiskers are precise sensors that measure openings and detect changes in the air around them.",
  },
];

/* ── Statistics ───────────────────────────────────────────── */
export const STATS = [
  { value: "1200+", label: "Pets Reunited", icon: "paw" },
  { value: "850+", label: "Successful Adoptions", icon: "heart" },
  { value: "340", label: "Breeding Matches", icon: "users" },
  { value: "6", label: "Cities Covered", icon: "smiley" },
] as const;

/* ── Testimonials ─────────────────────────────────────────── */
export interface Testimonial {
  id: string;
  avatar: string;
  name: string;
  role: string;
  stars: number;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    avatar: "/assets/hero-avatar-1.png",
    name: "Sara Al-Harbi",
    role: "Reunited with Luna",
    stars: 5,
    quote:
      "I posted at midnight and by morning three people had called. Luna was home within 24 hours. This platform is a blessing.",
  },
  {
    id: "t-2",
    avatar: "/assets/hero-avatar-2.png",
    name: "Mohammed Faisal",
    role: "Adopted Bruno",
    stars: 5,
    quote:
      "The adoption listing told me everything — vaccines, health, temperament. Bruno settled in like he'd always lived with us.",
  },
  {
    id: "t-3",
    avatar: "/assets/avatar-user.png",
    name: "Layla Nasser",
    role: "Breeder",
    stars: 4,
    quote:
      "Found the perfect match for my chihuahua through a breeding request. Smooth contact, serious owners, healthy puppies.",
  },
];

/* ── FAQ ──────────────────────────────────────────────────── */
export const FAQS = [
  {
    q: "How do I report a lost pet?",
    a: "Open Lost & Found, press “Report a Lost Pet” and fill in the form with a clear photo, the last seen location and two contact numbers. Your report is published instantly and appears in city-filtered searches.",
  },
  {
    q: "Is adopting through Helpet free?",
    a: "Yes. Helpet never charges adoption fees. Individual publishers may ask for a symbolic rehoming fee to ensure serious commitment — this is always stated in the listing description.",
  },
  {
    q: "How are breeding requests moderated?",
    a: "Every breeding request must include the pet's age, gender and health details. Reports of inaccurate listings are reviewed within 24 hours and repeat offenders are removed.",
  },
  {
    q: "Can I edit or delete my listings?",
    a: "Absolutely. Go to My Account → My Listings. Every lost report, adoption listing and breeding request you published has Edit and Delete controls plus a live status you can change.",
  },
  {
    q: "Which cities does Helpet cover?",
    a: "We currently cover Riyadh, Jeddah, Dammam, Mecca, Medina and Khobar — with more cities added as the community grows.",
  },
];

/* ── Account / profile demo data ──────────────────────────── */
export const PROFILE = {
  avatar: "/assets/avatar.png",
  name: "Fuad Al-Anbari",
  email: "fuad.3nbs@gmail.com",
  phone: "+966 50 123 4567",
};

export interface MyPet {
  id: string;
  photo: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
}

export const MY_PETS: MyPet[] = [
  { id: "mp-1", photo: "/assets/pet-1.png", name: "Luna", type: "Dog", breed: "Chihuahua", age: "2 years" },
  { id: "mp-2", photo: "/assets/hero-card-pet.png", name: "Mango", type: "Cat", breed: "Orange Tabby", age: "1 year" },
  { id: "mp-3", photo: "/assets/pet-5.png", name: "Coco", type: "Bird", breed: "Cockatiel", age: "2 years" },
];

export type ListingStatus = "Active" | "Pending" | "Closed";
export interface MyListing {
  id: string;
  photo: string;
  title: string;
  meta: string;
  status: ListingStatus;
}

export const MY_LISTINGS: {
  lost: MyListing[];
  adoption: MyListing[];
  breeding: MyListing[];
} = {
  lost: [
    {
      id: "ml-1",
      photo: "/assets/pet-1.png",
      title: "Luna — Chihuahua",
      meta: "Lost near Al Olaya, Riyadh · 3 days ago",
      status: "Active",
    },
  ],
  adoption: [
    {
      id: "ml-2",
      photo: "/assets/pet-5.png",
      title: "Kiwi — Budgerigar",
      meta: "Adoption listing · Medina · 1 week ago",
      status: "Pending",
    },
    {
      id: "ml-3",
      photo: "/assets/pet-3.png",
      title: "Fluffy — Poodle",
      meta: "Adoption listing · Dammam · 3 weeks ago",
      status: "Closed",
    },
  ],
  breeding: [
    {
      id: "ml-4",
      photo: "/assets/hero-card-pet.png",
      title: "Mango — Orange Tabby",
      meta: "Breeding request · Riyadh · 5 days ago",
      status: "Active",
    },
  ],
};
