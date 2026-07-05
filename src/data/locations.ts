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
    id: "ruma-homestay",
    name: "RUMA Homestay",
    location: "Rivervale, KotaSAS",
    description: "A beautiful, fully-furnished 3-bedroom homestay perfect for families and group gatherings.",
    rating: 5.0,
    price: 240, // Weekday price, weekend is 270
    image: masterBed,
    images: [masterBed, secondMaster, room1, livingRoom, kitchen, hall],
    features: ["3 Bedrooms", "Air-Conditioned", "Smart TV & Netflix", "Free WiFi", "Washing Machine"],
    featured: true,
    amenities: [
      { icon: Bed, label: "Bedrooms", description: "2 Queen beds, 1 Single bed" },
      { icon: Wind, label: "Air-Cond", description: "Fully air-conditioned house" },
      { icon: Tv, label: "Entertainment", description: "Smart TV with Netflix & Free WiFi" },
      { icon: Utensils, label: "Kitchen", description: "Fully equipped with microwave & stove" },
      { icon: Bath, label: "Bathrooms", description: "Water heaters provided" },
      { icon: Car, label: "Parking", description: "Free parking space available" }
    ],
    details: [
      "Master bedroom with Queen bed & attached toilet",
      "Second bedroom with Queen bed",
      "Third bedroom with Single bed (can serve as prayer room)",
      "Comfortable living room with Netflix",
      "High-speed Free WiFi",
      "Fully equipped kitchen",
      "Washing machine provided"
    ],
    reviews: []
  }
];

export const getFeaturedLocations = () => locations.filter(loc => loc.featured);

export const getLocationById = (id: string) => locations.find(loc => loc.id === id);
