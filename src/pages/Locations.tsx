import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowRight } from "lucide-react";
import bannerImage from "@/images/2.png";
import { locations } from "@/data/locations";

const Locations = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

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

      <main className="py-24 lg:py-32 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 block">
              Our Property
            </span>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-4">
              Rooms & Shared Spaces
            </h1>
            <p className="text-sm text-muted-foreground font-light max-w-md mx-auto">
              Explore the comfortable spaces in our homestay
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border border-border bg-card shadow-soft hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/location/${location.id}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="font-light text-xs">{location.rating}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-base font-normal mb-1 text-card-foreground tracking-tight">
                        {location.name}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground mb-4 text-xs font-light">
                        <MapPin className="h-3 w-3" />
                        <span>{location.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {location.features.map((feature) => (
                          <span
                            key={feature}
                            className="text-[10px] uppercase tracking-wide px-2 py-1 bg-accent text-accent-foreground rounded-sm font-light"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs font-light ml-auto">
                          View Details
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Locations;
