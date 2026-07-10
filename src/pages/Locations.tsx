import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LocationsComponent from "@/components/Locations";
import Booking from "@/components/Booking";
import bannerImage from "@/images/exterior.webp";

const Locations = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Image with Parallax */}
        <div className="relative w-full h-[50vh] overflow-hidden">
          <motion.img
            src={bannerImage}
            alt="Locations banner"
            style={{ y }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="-mt-16 relative z-10 bg-background">
           <LocationsComponent />
        </div>

        <Booking />
      </main>

      <Footer />
    </div>
  );
};

export default Locations;
