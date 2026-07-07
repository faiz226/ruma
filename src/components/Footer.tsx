import { Instagram, Facebook, Twitter, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-foreground text-background py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-10 lg:gap-12">
          {/* Brand Row */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="RUMA by EL Stay Treat" className="h-10 w-auto brightness-0 invert" />
            </div>
            <p className="text-background/70 text-xs font-light leading-relaxed max-w-xs">
              A guarded, comfortable 3-bedroom homestay fully equipped for a home-like stay in Rivervale, KotaSAS.
            </p>
          </div>

          {/* Pages Row - Two Columns on Mobile */}
          <div>
            <h4 className="text-sm font-medium mb-4">Pages</h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Rooms & Spaces
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Contact
                </Link>
              </li>
              <li>
                <a href="/#booking" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Book Now
                </a>
              </li>
              <li>
                <Link to="/admin" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Row */}
          <div>
            <h4 className="text-sm font-medium mb-4">Legal</h4>
            <ul className="flex flex-col gap-y-3">
              <li>
                <Link to="/terms" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-background/70 hover:text-background smooth-hover text-xs font-light">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Row */}
          <div>
            <h4 className="text-sm font-medium mb-4">Contact Us</h4>
            <div className="flex flex-col gap-2 mb-8">
              <a href="tel:+601112983754" className="text-background/70 hover:text-background smooth-hover text-xs font-light flex items-center gap-2">
                <Phone className="h-3 w-3" />
                011-1298 3754 (Auni)
              </a>
              <a href="mailto:atirahauni.work@gmail.com" className="text-background/70 hover:text-background smooth-hover text-xs font-light flex items-center gap-2">
                <Mail className="h-3 w-3" />
                atirahauni.work@gmail.com
              </a>
            </div>

            <h4 className="text-sm font-medium mb-4">Follow Us</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="text-background/70 hover:text-background smooth-hover" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-background/70 hover:text-background smooth-hover" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@ruma.homestaykotasas" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-background smooth-hover" aria-label="TikTok">
                <svg viewBox="0 0 448 512" fill="currentColor" className="h-4 w-4">
                  <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 mt-12 text-center text-background/50 text-xs font-light">
          <p>&copy; {new Date().getFullYear()} RUMA by EL Stay Treat. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;