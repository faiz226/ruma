import { motion, useScroll, useTransform } from "framer-motion";
import { Home, Heart, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import bannerImage from "@/assets/detail-lake-2.jpg";

const pillars = [
  {
    icon: Home,
    title: "A Real Home",
    description: "Every corner has been thoughtfully furnished so you can relax and settle in without worrying about the details."
  },
  {
    icon: Heart,
    title: "Personal Care",
    description: "As a small, hands-on team, we personally take care of every booking. You're never just a reservation number to us."
  },
  {
    icon: Users,
    title: "For Everyone",
    description: "Designed for young families, larger groups, quiet retreats, and short work trips alike — welcoming to all."
  }
];

const About = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      {/* Hero Image with Parallax */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <motion.img
          src={bannerImage}
          alt="Serene lake surrounded by nature"
          style={{ y }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <main>
        {/* Our Story Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">About Us</span>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight mt-2 mb-8">
                About RUMA by EL Stay Treat
              </h1>

              <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                <p>
                  RUMA is a family-run homestay nestled in Rivervale, KotaSAS — a peaceful residential neighborhood
                  just minutes from Kuantan's main attractions.
                </p>
                <p>
                  We started EL Stay Treat with a simple goal: to give travelers a place that genuinely feels like
                  home, not just another place to sleep. Whether you're visiting for a family getaway, a quiet
                  retreat, or a short work trip, we've designed RUMA to be comfortable, clean, and welcoming for
                  everyone — from young families to larger groups.
                </p>
                <p>
                  Every corner of the house has been thoughtfully furnished, from the cozy bedrooms to the shared
                  living spaces, so you can relax and settle in without worrying about the details. As a small,
                  hands-on hospitality team, we personally take care of every booking — which means you're never
                  just a reservation number to us.
                </p>
                <p>
                  We look forward to hosting you and making your stay truly feel like home.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">What Makes Us Different</span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-2">Our Promise</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 border border-border rounded-lg bg-card shadow-soft hover:shadow-md transition-shadow duration-300"
                >
                  <pillar.icon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="text-lg font-light tracking-tight mb-3">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;