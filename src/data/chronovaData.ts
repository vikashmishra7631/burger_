export interface WatchModel {
  id: string;
  name: string;
  collection: string;
  tagline: string;
  price: number;
  priceFormatted: string;
  isLimited?: boolean;
  editionCount?: string;
  image: string;
  alternateImages: string[];
  specs: {
    movement: string;
    crystal: string;
    waterResistance: string;
    powerReserve: string;
    caseMaterial: string;
    caseDiameter: string;
    caseThickness: string;
    lugWidth: string;
    bezel: string;
    strap: string;
    warranty: string;
  };
  description: string;
  features: string[];
}

export interface CollectionItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  count: string;
  accent: string;
}

export interface ExplodedLayer {
  id: string;
  name: string;
  role: string;
  material: string;
  tolerance: string;
  description: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  quote: string;
  watchOwned: string;
  avatar: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  image: string;
  aspect: 'portrait' | 'landscape' | 'square';
  tag: string;
}

export const APEX_GT01: WatchModel = {
  id: "apex-gt01",
  name: "CHRONOVA APEX GT-01",
  collection: "LIMITED EDITION",
  tagline: "Precision engineered for those who value every second.",
  price: 1299,
  priceFormatted: "$1,299",
  isLimited: true,
  editionCount: "Limited to 500 numbered timepieces",
  image: "/images/hero_watch.jpg",
  alternateImages: [
    "/images/hero_watch.jpg",
    "/images/limited_watch.jpg",
    "/images/mechanical_watch.jpg",
    "/images/sport_watch.jpg",
  ],
  specs: {
    movement: "Calibre CN-8800 In-House Automatic Chronograph",
    crystal: "Double-Domed Sapphire Crystal with Multi-Layer Anti-Reflective Coating",
    waterResistance: "100 Meters / 10 ATM (Screw-Down Crown & Pushers)",
    powerReserve: "72-Hour Autonomous Reserve",
    caseMaterial: "316L Surgical-Grade Brushed Stainless Steel with Polished Chamfers",
    caseDiameter: "42.0 mm",
    caseThickness: "12.8 mm",
    lugWidth: "22 mm Tapering to 20 mm",
    bezel: "Ceramic Tachymeter Bezel with Bronze Laser-Engraved Numerals",
    strap: "Italian Full-Grain Black Alligator Embossed Leather with Champagne Stitching",
    warranty: "5-Year International Chronova Manufacturer Guarantee",
  },
  description: "The Apex GT-01 represents the pinnacle of Chronova horology. Designed as a high-frequency automatic chronograph, it pairs high-grade 316L stainless steel with champagne-gold galvanic dial accents, three subsidiary chronograph counters, and our proprietary CN-8800 column-wheel movement.",
  features: [
    "Column-wheel chronograph with instant flyback actuation",
    "Super-LumiNova BGW9 luminous hands and applied indices",
    "Exhibition sapphire crystal caseback with gold skeletonized rotor",
    "Individually serialized laser engraving on case flank",
    "Delivered in handcrafted piano-lacquered walnut presentation chest"
  ]
};

export const COLLECTIONS_DATA: CollectionItem[] = [
  {
    id: "classic",
    name: "CLASSIC",
    subtitle: "Timeless elegance.",
    description: "Ultra-thin profiles, sunburst dials, and minimalist dauphine hands crafted for formal sophistication.",
    image: "/images/classic_watch.jpg",
    count: "6 Models",
    accent: "#dfb15b"
  },
  {
    id: "sport",
    name: "SPORT",
    subtitle: "Built for the bold.",
    description: "High-performance forged carbon bezels, tactile rubber straps, and 200m water resistance for uncompromising durability.",
    image: "/images/sport_watch.jpg",
    count: "8 Models",
    accent: "#ff6b35"
  },
  {
    id: "limited",
    name: "LIMITED EDITION",
    subtitle: "Rare by design.",
    description: "Numbered collector pieces featuring smoked sapphire dials, DLC titanium alloys, and bespoke complications.",
    image: "/images/limited_watch.jpg",
    count: "Exclusive 500 Pcs",
    accent: "#dfb15b"
  },
  {
    id: "mechanical",
    name: "MECHANICAL",
    subtitle: "Crafted with soul.",
    description: "Fully openworked skeletonized movements revealing the intricate heartbeat of Swiss escapements and Geneva stripes.",
    image: "/images/mechanical_watch.jpg",
    count: "4 Masterpieces",
    accent: "#00e5ff"
  }
];

export const BRAND_STATS = [
  { value: "10+", label: "Years of Craftsmanship", sub: "Geneva & Zurich Ateliers" },
  { value: "50K+", label: "Watches Created", sub: "Worn by Discerning Collectors" },
  { value: "25+", label: "Countries", sub: "Global Flagship Salons" },
  { value: "100%", label: "Precision Tested", sub: "5-Position Chronometer Testing" },
];

export const EXPLODED_LAYERS: ExplodedLayer[] = [
  {
    id: "sapphire",
    name: "Sapphire Crystal",
    role: "Front Protection",
    material: "Synthetic Corundum (9 Mohs Hardness)",
    tolerance: "±0.002 mm curvature",
    description: "Scratch-proof double domed crystal treated with 7 layers of internal anti-reflective blue coating for glare-free visibility.",
    iconName: "Shield"
  },
  {
    id: "bezel",
    name: "Tachymeter Bezel",
    role: "Speed Computation",
    material: "High-Tech Zirconia Ceramic",
    tolerance: "Laser engraved & filled",
    description: "Ultra-hard ceramic ring impervious to scratches, laser engraved with champagne gold tachymetric scale to measure speeds up to 400 km/h.",
    iconName: "Compass"
  },
  {
    id: "dial",
    name: "Chronograph Dial",
    role: "Visual Interface",
    material: "Galvanic Onyx Brass with Gold Accents",
    tolerance: "Hand-applied faceted indices",
    description: "Deep black sunray finish featuring triple concentric chronograph subdials and hand-applied champagne gold hour markers.",
    iconName: "Eye"
  },
  {
    id: "hands",
    name: "Precision Hands",
    role: "Time Indication",
    material: "Polished Gold PVD & Super-LumiNova",
    tolerance: "Balanced to 0.001g weight",
    description: "Diamond-cut skeleton hands filled with Grade A Super-LumiNova for effortless legibility in low-light cockpit environments.",
    iconName: "Clock"
  },
  {
    id: "movement",
    name: "Automatic Movement",
    role: "Mechanical Engine",
    material: "Calibre CN-8800 · 34 Jewels",
    tolerance: "28,800 VpH (4Hz) · 72h Reserve",
    description: "In-house mechanical caliber with integrated column wheel, Glucydur balance, and tungsten-gold winding rotor.",
    iconName: "Cpu"
  },
  {
    id: "case",
    name: "316L Stainless Steel Case",
    role: "Structural Monocoque",
    material: "Cold-Forged 316L Stainless Steel",
    tolerance: "100m Hydrostatic Pressure Rated",
    description: "Brushed flanks contrasting with mirror-polished beveled edges, machined from a solid block of medical-grade steel.",
    iconName: "Layers"
  },
  {
    id: "caseback",
    name: "Exhibition Caseback",
    role: "Movement Viewport",
    material: "Threaded Titanium Ring & Sapphire Glass",
    tolerance: "Screw-down gasket seal",
    description: "Transparent window showcasing the circular Geneva stripes, blued screws, and custom serialized rotor.",
    iconName: "Maximize2"
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "t1",
    name: "Marcus Sterling",
    title: "Senior Automotive Designer",
    location: "Milan, Italy",
    rating: 5,
    quote: "The industrial finishing and weight distribution of the Apex GT-01 rival timepieces five times its price. The tactile click of the column-wheel chronograph pushers is perfection.",
    watchOwned: "Apex GT-01 #084/500",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "t2",
    name: "Elena Rostova",
    title: "Venture Partner & Collector",
    location: "Zurich, Switzerland",
    rating: 5,
    quote: "Chronova successfully bridges classic Swiss horology with futuristic minimalism. The champagne-gold highlights on the black dial create mesmerizing reflections in evening light.",
    watchOwned: "Chronova Classic Champagne",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "t3",
    name: "David H. Kensington",
    title: "Aerospace Systems Lead",
    location: "London, UK",
    rating: 5,
    quote: "The 72-hour power reserve and 100m water resistance make this my daily driver. You can immediately feel the obsessive engineering behind the steel case and sapphire crystal.",
    watchOwned: "Chronova Mechanical Skeleton",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Twilight Mountain Drive",
    location: "San Bernardino Pass, Switzerland",
    image: "/images/lifestyle_car.jpg",
    aspect: "landscape",
    tag: "AUTOMOTIVE"
  },
  {
    id: "g2",
    title: "Alpine Mist & Sustainable Design",
    location: "Black Forest Horology Atelier",
    image: "/images/sustainability.jpg",
    aspect: "square",
    tag: "SUSTAINABILITY"
  },
  {
    id: "g3",
    title: "Master Bench Assembly",
    location: "Geneva Workshop #04",
    image: "/images/craftsman.jpg",
    aspect: "square",
    tag: "CRAFTSMANSHIP"
  },
  {
    id: "g4",
    title: "Apex GT-01 Limited Edition",
    location: "Zurich Studio Exhibition",
    image: "/images/limited_watch.jpg",
    aspect: "portrait",
    tag: "LIMITED EDITION"
  },
  {
    id: "g5",
    title: "Calibre CN-8800 Skeleton",
    location: "Horology Lab Macro Lens",
    image: "/images/mechanical_watch.jpg",
    aspect: "square",
    tag: "IN-HOUSE CALIBRE"
  },
  {
    id: "g6",
    title: "Classic Sunburst Elegance",
    location: "Milano Private Salon",
    image: "/images/classic_watch.jpg",
    aspect: "portrait",
    tag: "CLASSIC"
  }
];
