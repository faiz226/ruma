import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="brx-footer" className="py-12 px-4 md:px-6 bg-foreground text-background border-t border-border/10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="RUMA Rivervale" className="h-8 w-auto brightness-0 invert" />
              <h2 className="text-lg font-bold">RUMA Rivervale</h2>
            </Link>

            <p className="text-background/70 mt-4 max-w-xs text-sm">
              A guarded, comfortable 3-bedroom homestay fully equipped for a home-like stay in Rivervale, KotaSAS.
            </p>
            <div className="mt-6">
              <a href="https://www.tiktok.com/@ruma.homestaykotasas" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="rounded-md">
                  Follow Us on TikTok
                  <svg viewBox="0 0 448 512" fill="currentColor" className="ml-2 h-4 w-4">
                    <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
                  </svg>
                </Button>
              </a>
            </div>
            <p className="text-sm text-background/50 mt-8">
              &copy; {new Date().getFullYear()} RUMA Rivervale. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-background/70 hover:text-background transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/locations" className="text-sm text-background/70 hover:text-background transition-colors">
                    Rooms & Spaces
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-background/70 hover:text-background transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-background/70 hover:text-background transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="/#booking" className="text-sm text-background/70 hover:text-background transition-colors">
                    Book Now
                  </a>
                </li>
                <li>
                  <Link to="/admin" className="text-sm text-background/70 hover:text-background transition-colors">
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a href="tel:+601112983754" className="text-sm text-background/70 hover:text-background transition-colors flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    011-1298 3754 (Auni)
                  </a>
                </li>
                <li>
                  <a href="mailto:atirahauni.work@gmail.com" className="text-sm text-background/70 hover:text-background transition-colors flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    Email Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-background/70 hover:text-background transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-background/70 hover:text-background transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="text-sm text-background/70 hover:text-background transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full flex mt-12 md:mt-24 items-center justify-center overflow-hidden">
          <h1 className="text-center text-[5rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] leading-none font-bold bg-clip-text text-transparent bg-gradient-to-b from-background/20 to-background/5 select-none">
            RUMA
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;