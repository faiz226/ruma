import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import img1 from "@/images/1.png";
import img2 from "@/images/2.png";
import img3 from "@/images/3.png";
import img4 from "@/images/4.png";

const slides = [
  { image: img1, alt: "RUMA by EL Stay Treat 1" },
  { image: img2, alt: "RUMA by EL Stay Treat 2" },
  { image: img3, alt: "RUMA by EL Stay Treat 3" },
  { image: img4, alt: "RUMA by EL Stay Treat 4" },
];

const SLIDE_DURATION = 5000;

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [nextSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image Ticker */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Bottom-Left Text Content */}
      <div className="absolute bottom-20 left-6 md:left-12 lg:left-16 z-10 text-white">
        {/* Tree Icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4"
        >
          <Home className="w-6 h-6 text-white stroke-[1.5]" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight max-w-md text-left flex flex-col"
        >
          <span>RUMA by</span>
          <span>EL Stay Treat</span>
          <span className="text-2xl mt-4 italic text-white/90">"Feel at home"</span>
        </motion.h1>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-6 flex items-center gap-3 bg-white text-foreground px-6 py-3 rounded-full text-sm tracking-wide hover:bg-white/90 transition-colors"
        >
          Book Now
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Progress Bars */}
      <div className="absolute bottom-8 left-6 md:left-12 lg:left-16 right-6 md:right-12 lg:right-16 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="flex-1 h-[2px] bg-white/30 overflow-hidden cursor-pointer"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index === currentSlide ? `${progress}%` : index < currentSlide ? "100%" : "0%",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
