import { Bed, Bath, Wind, Tv, Utensils, Car } from "lucide-react";
import masterBed from "@/images/Master Bedroom.jpeg";
import secondMaster from "@/images/Another master bedroom.jpeg";
import room1 from "@/images/Room 1.jpeg";
import livingRoom from "@/images/Living room.jpeg";
import kitchen from "@/images/Kitchen Island.jpeg";
import hall from "@/images/Hall.jpeg";

export interface Review {
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Location {
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  price: number;
  image: string;
  images: string[];
  features: string[];
  featured: boolean;
  amenities: {
    icon: any;
    label: string;
    description: string;
  }[];
  details: string[];
  reviews: Review[];
}

export const locations: Location[] = [
  {
    id: "master-bedroom",
    name: "Master Bedroom",
    location: "RUMA by EL Stay Treat",
    description: "Spacious master bedroom designed for ultimate comfort.",
    rating: 5.0,
    price: 0,
    image: masterBed,
    images: [masterBed, secondMaster],
    features: ["Queen Bed", "Air-Conditioned", "Wardrobe Rail", "Attached Toilet"],
    featured: true,
    amenities: [
      { icon: Bed, label: "Queen Bed", description: "Comfortable queen-sized bed" },
      { icon: Wind, label: "Air-Cond", description: "Fully air-conditioned room" },
      { icon: Bath, label: "Water Heater", description: "Attached toilet with water heater" },
    ],
    details: [
      "Queen size bed",
      "Air conditioning",
      "Wardrobe rail for clothing",
      "Attached toilet",
      "Fresh linens and towels provided"
    ],
    reviews: []
  },
  {
    id: "second-master",
    name: "Second Master Bedroom",
    location: "RUMA by EL Stay Treat",
    description: "Comfortable second master bedroom perfect for couples.",
    rating: 5.0,
    price: 0,
    image: secondMaster,
    images: [secondMaster, masterBed],
    features: ["Queen Bed", "Air-Conditioned"],
    featured: true,
    amenities: [
      { icon: Bed, label: "Queen Bed", description: "Comfortable queen-sized bed" },
      { icon: Wind, label: "Air-Cond", description: "Fully air-conditioned room" }
    ],
    details: [
      "Queen size bed",
      "Air conditioning",
      "Fresh linens and towels provided"
    ],
    reviews: []
  },
  {
    id: "single-bedroom",
    name: "Single Bedroom / Prayer Room",
    location: "RUMA by EL Stay Treat",
    description: "Cozy single bedroom that can also be used as a prayer room.",
    rating: 5.0,
    price: 0,
    image: room1,
    images: [room1],
    features: ["Single Bed", "Air-Conditioned", "Mirror"],
    featured: true,
    amenities: [
      { icon: Bed, label: "Single Bed", description: "Comfortable single bed" },
      { icon: Wind, label: "Air-Cond", description: "Fully air-conditioned room" }
    ],
    details: [
      "Single size bed",
      "Air conditioning",
      "Full-length mirror",
      "Can serve as a prayer room"
    ],
    reviews: []
  },
  {
    id: "living-room",
    name: "Living Room",
    location: "RUMA by EL Stay Treat",
    description: "Relaxing living area for family gatherings and entertainment.",
    rating: 5.0,
    price: 0,
    image: livingRoom,
    images: [livingRoom, hall],
    features: ["Sofa Seating", "Smart TV", "Netflix", "Free WiFi"],
    featured: true,
    amenities: [
      { icon: Tv, label: "Entertainment", description: "TV area with Netflix" },
      { icon: Wind, label: "Comfort", description: "Cozy rug and sofa seating" }
    ],
    details: [
      "Comfortable sofa seating",
      "Cozy rug area",
      "TV area with Netflix",
      "High-speed Free WiFi"
    ],
    reviews: []
  },
  {
    id: "kitchen",
    name: "Kitchen",
    location: "RUMA by EL Stay Treat",
    description: "Fully equipped kitchen for all your cooking needs.",
    rating: 5.0,
    price: 0,
    image: kitchen,
    images: [kitchen],
    features: ["Fully Equipped", "Stove", "Microwave", "Washing Machine"],
    featured: true,
    amenities: [
      { icon: Utensils, label: "Cooking", description: "Basic cooking essentials provided" },
      { icon: Wind, label: "Appliances", description: "Iron, kettle, cooker, microwave & washing machine" }
    ],
    details: [
      "Stove and sink",
      "Microwave oven",
      "Kitchen cabinets",
      "Basic cooking essentials",
      "Washing machine provided"
    ],
    reviews: []
  }
];

export const getFeaturedLocations = () => locations.filter(loc => loc.featured);

export const getLocationById = (id: string) => locations.find(loc => loc.id === id);
