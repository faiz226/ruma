import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { getFeaturedLocations } from "@/data/locations";
import { useIsMobile } from "@/hooks/use-mobile";

const Locations = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isMobile = useIsMobile();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const featuredLocation = getFeaturedLocations()[0];

  const gallerySpaces = [
    { id: 'master-bedroom', name: 'Master Bedroom', image: featuredLocation.images[0] },
    { id: 'second-master', name: 'Second Master Bedroom', image: featuredLocation.images[1] },
    { id: 'single-bedroom', name: 'Single Bedroom / Prayer Room', image: featuredLocation.images[2] },
    { id: 'living-room', name: 'Living Room', image: featuredLocation.images[3] },
    { id: 'kitchen', name: 'Kitchen', image: featuredLocation.images[4] }
  ];

  const getCardStyle = (index: number) => {
    const baseRotation = [-8, -4, 0, 4, 8];
    const baseX = [-300, -150, 0, 150, 300];
    return { rotate: baseRotation[index], x: baseX[index] };
  };

  const renderMainCard = () => (
    <Card className="overflow-hidden border border-border bg-card shadow-lg max-w-4xl mx-auto w-full">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
          <img src={featuredLocation.image} alt={featuredLocation.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-light text-xs">{featuredLocation.rating}</span>
          </div>
        </div>
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-light mb-2 text-card-foreground tracking-tight">{featuredLocation.name}</h3>
            <div className="flex items-center gap-1 text-muted-foreground mb-6 text-sm font-light">
              <MapPin className="h-4 w-4" />
              <span>{featuredLocation.location}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredLocation.features.map((feature) => (
                <span key={feature} className="text-[10px] md:text-xs uppercase tracking-wide px-3 py-1.5 bg-accent text-accent-foreground rounded-sm font-light">{feature}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground font-light mb-1">From</p>
              <p className="text-xl md:text-2xl font-light">RM {featuredLocation.price} <span className="text-sm text-muted-foreground">/night</span></p>
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto text-[11px] uppercase tracking-wider font-normal">
              <a href="#booking">Book Now</a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderGalleryCard = (space: typeof gallerySpaces[0]) => (
    <div className="relative h-64 overflow-hidden group">
      <img src={space.image} alt={space.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
        <h3 className="text-white text-lg font-light tracking-wide">{space.name}</h3>
      </div>
    </div>
  );

  return (
    <section id="locations" className="py-16 lg:py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 block">
            Our Property
          </span>
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-foreground tracking-tight">
            Explore Our Spaces
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-light">
            Comfortable, air-conditioned rooms and spacious living areas for your family.
          </p>
        </motion.div>

        <div className="mb-24">
          {renderMainCard()}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 block">
            Gallery
          </span>
          <h3 className="text-xl md:text-2xl font-light mb-2 text-foreground tracking-tight">
            Inside RUMA Homestay
          </h3>
        </motion.div>

        {isMobile ? (
          <div className="flex flex-col gap-6 w-full overflow-hidden">
            {gallerySpaces.map((space) => (
              <div key={space.id} className="w-full">
                <Card className="overflow-hidden border border-border bg-card shadow-lg w-full">
                  {renderGalleryCard(space)}
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative flex justify-center items-center h-[500px]">
            {gallerySpaces.map((space, index) => {
              const isHovered = hoveredIndex === index;
              const cardStyle = getCardStyle(index);
              return (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, y: 50, ...cardStyle }}
                  whileInView={{ opacity: 1, y: isHovered ? -20 : 0, rotate: isHovered ? 0 : cardStyle.rotate, x: cardStyle.x, scale: isHovered ? 1.05 : 1, zIndex: isHovered ? 50 : 10 - Math.abs(index - 2) }}
                  transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="absolute w-[320px]"
                  style={{ zIndex: isHovered ? 50 : 10 - Math.abs(index - 2) }}
                >
                  <Card className={`overflow-hidden border border-border bg-card transition-shadow duration-300 ${isHovered ? 'shadow-2xl' : 'shadow-lg'}`}>
                    {renderGalleryCard(space)}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Locations;