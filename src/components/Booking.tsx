import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval } from "date-fns";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { CalendarDays, ArrowRight, ArrowLeft, CheckCircle, User, Phone, Mail, MapPinned, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

const Booking = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Form step state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  
  // Step 1 fields
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [bookedDates, setBookedDates] = useState<{start: Date, end: Date}[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('check_in, check_out, status, locked_until')
        .in('status', ['PAID', 'confirmed', 'PENDING_PAYMENT']);
        
      if (data && !error) {
        const validBookings = data;
        setBookedDates(validBookings.map(b => ({
          start: new Date(b.check_in + 'T00:00:00'),
          end: new Date(b.check_out + 'T00:00:00')
        })));
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'failed' || params.get('status') === 'canceled') {
      toast.error("Payment failed or was cancelled. Please try again.");
      setBookingRef(params.get('ref') || "");
      // Remove query params from URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.has('ref')) {
      setBookingRef(params.get('ref') || "");
      setStep(3);
      setTimeout(() => {
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  // Step 2 fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");

  const handleStep1Continue = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please fill in all fields including check-in and check-out dates");
      return;
    }
    setDirection(1);
    setStep(2);
  };

  const handleStep2Back = () => {
    setDirection(-1);
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!name || !phone || !email || !postcode) {
      toast.error("Please fill in all contact details");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    // Construct WhatsApp message
    const message = `NAME: ${name}
Email: ${email}
Phone: ${phone}
Check in: ${dateRange?.from ? format(dateRange.from, "dd-MM-yyyy") : ''}
Check out: ${dateRange?.to ? format(dateRange.to, "dd-MM-yyyy") : ''}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/60148537905?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      setIsSubmitting(false);
      // Optional: Move to step 3 or just leave them on the form
      // setStep(3);
    }, 1000);
  };

  const handleReset = () => {
    setDirection(-1);
    setStep(1);
    setDateRange({ from: new Date(), to: undefined });
    setName("");
    setPhone("");
    setEmail("");
    setPostcode("");
  };

  // Pricing is calculated dynamically by day-of-week (client-side here, and verified server-side).
  // The 'base_price_cents' column in the database is completely unused for actual charges.
  const calculatePrice = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    
    let total = 0;
    let currentDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    
    while (currentDate < endDate) {
      const day = currentDate.getDay();
      // Friday (5) and Saturday (6) are weekends
      if (day === 5 || day === 6) {
        total += 270;
      } else {
        total += 240;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return total;
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return "";
    if (!dateRange?.to) return format(dateRange.from, "MMM d, yyyy");
    return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  };

  const isDateDisabled = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
    
    return bookedDates.some(booking => {
      return isWithinInterval(date, { start: booking.start, end: booking.end });
    });
  };

  return (
    <section id="booking" className="py-16 lg:py-24 bg-accent/20" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 block">
            Reservations
          </span>
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-foreground tracking-tight">
            Book Your Escape
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-light">
            Choose your dates and let nature work its magic
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="p-8 lg:p-10 shadow-soft border border-border bg-card overflow-hidden">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step ? "w-8 bg-primary" : s < step ? "w-4 bg-primary/50" : "w-4 bg-border"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <div className="bg-card/50 rounded-md p-4 mb-4 border border-border">
                          <p className="text-sm font-medium mb-2">Homestay Pricing</p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Weekday Rate: RM240 / night (Sun - Thu)</p>
                            <p>Weekend Rate: RM270 / night (Fri - Sat)</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          size="default"
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md smooth-hover text-[11px] uppercase tracking-wider font-normal"
                          onClick={handleStep1Continue}
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                        <CalendarDays className="h-3 w-3" />
                        Check-in & Check-out
                      </Label>
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                        className="rounded-md border-border shadow-soft text-sm pointer-events-auto"
                        disabled={isDateDisabled}
                      />
                      {dateRange?.from && dateRange?.to && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-md text-center">
                          <p className="text-xs text-foreground font-medium">
                            {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nights selected
                          </p>
                          <p className="text-sm font-semibold text-primary mt-1">
                            Total: RM{calculatePrice()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="space-y-6 max-w-md mx-auto">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                        <User className="h-3 w-3" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-md text-sm font-light"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                        <Phone className="h-3 w-3" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+44 7700 900000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="rounded-md text-sm font-light"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                        <Mail className="h-3 w-3" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-md text-sm font-light"
                      />
                    </div>

                    <div>
                      <Label htmlFor="postcode" className="flex items-center gap-1.5 mb-3 text-card-foreground text-[11px] uppercase tracking-wider font-normal">
                        <MapPinned className="h-3 w-3" />
                        Postcode
                      </Label>
                      <Input
                        id="postcode"
                        type="text"
                        placeholder="SW1A 1AA"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="rounded-md text-sm font-light"
                      />
                    </div>

                    <div className="pt-2 pb-1 text-center">
                      <p className="text-[10px] text-muted-foreground font-light">
                        By continuing, you agree to our <Link to="/terms" className="underline hover:text-foreground smooth-hover" target="_blank">Terms & Conditions</Link> and <Link to="/privacy" className="underline hover:text-foreground smooth-hover" target="_blank">Privacy Policy</Link>.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        size="default"
                        className="flex-1 rounded-md smooth-hover text-[11px] uppercase tracking-wider font-normal"
                        onClick={handleStep2Back}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        size="default"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md smooth-hover text-[11px] uppercase tracking-wider font-normal"
                        onClick={handleSubmit}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Opening WhatsApp...
                          </>
                        ) : (
                          "Send via WhatsApp"
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="text-center py-8 space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="h-16 w-16 text-primary mx-auto" />
                    </motion.div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-light text-foreground">Booking Confirmed</h3>
                      <p className="text-sm text-muted-foreground font-light">
                        Thank you, {name}! Your reservation has been submitted.
                      </p>
                    </div>

                    <div className="bg-accent/30 rounded-md p-4 max-w-sm mx-auto text-left space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Booking Summary</p>
                      <div className="text-sm font-light text-foreground space-y-1">
                        <p><span className="text-muted-foreground">Property:</span> RUMA by EL Stay Treat</p>
                        <p><span className="text-muted-foreground">Dates:</span> {formatDateRange()}</p>
                        <p className="font-medium text-primary mt-2 pt-2 border-t border-border"><span className="text-muted-foreground">Total Price:</span> RM{calculatePrice()}</p>
                        {bookingRef && <p><span className="text-muted-foreground">Reference:</span> {bookingRef}</p>}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground font-light">
                      A confirmation email has been sent to your address.
                    </p>

                    <Button
                      variant="outline"
                      size="default"
                      className="rounded-md smooth-hover text-[11px] uppercase tracking-wider font-normal mt-4"
                      onClick={handleReset}
                    >
                      Book Another Stay
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Booking;
