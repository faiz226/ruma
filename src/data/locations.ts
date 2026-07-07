import { Bed, Bath, Wind, Tv, Utensils, Car } from "lucide-react";
import img1 from "@/images/living_room.webp"; // 1
import img2 from "@/images/exterior.webp"; // 2
import img3 from "@/images/second_bedroom.webp"; // 3 (Master Bedroom alternate)
import img4 from "@/images/gate.webp"; // 4
import img5 from "@/images/hallway.webp"; // 5 (Kitchen/Dining)
import img6 from "@/images/hallway_art.webp"; // 6 (Hallway art)
import img7 from "@/images/living_room_seating.webp"; // 7 (Living Room)
import img8 from "@/images/kitchen.webp"; // 8 (Kitchen/Dining)
import img9 from "@/images/master_bedroom_1.webp"; // 9 (Master Bedroom)
import img10 from "@/images/master_bedroom_2.webp"; // 10 (Second Master Bedroom)
import img11 from "@/images/single_bedroom.webp"; // 11 (Third Room)
import img12 from "@/images/dining_area.webp"; // 12 (Kitchen/Dining)

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
    image: img2,
    images: [img2, img1, img7, img9, img3, img10, img11, img12, img8, img5, img6, img4],
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
