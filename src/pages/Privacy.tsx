import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            <strong>Effective Date:</strong> July 2026
          </p>

          <div className="text-muted-foreground text-sm md:text-base leading-relaxed space-y-6">
            <p>
              At <strong className="text-foreground font-medium">RUMA by EL Stay Treat</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information in compliance with the Personal Data Protection Act (PDPA) of Malaysia.
            </p>

            <h2 className="text-xl font-medium text-foreground pt-4">1. Information We Collect</h2>
            <p>When you make a booking inquiry via our website and WhatsApp, we collect the following personal information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number (WhatsApp)</li>
              <li>Dates of Stay</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground pt-4">2. How We Use Your Information</h2>
            <p>Your personal information is used exclusively for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To process, confirm, and manage your reservation.</li>
              <li>To communicate with you regarding your stay (e.g., sending check-in instructions or payment details via WhatsApp or Email).</li>
              <li>To respond to any questions or inquiries you submit through our contact form.</li>
              <li>To maintain an internal record of bookings.</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground pt-4">3. Data Sharing & Protection</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">No Third-Party Sharing:</strong> We do not sell, rent, or trade your personal information to any third parties for marketing purposes.</li>
              <li><strong className="text-foreground font-medium">Security:</strong> We implement reasonable security measures to protect your personal data from unauthorized access, alteration, or disclosure.</li>
              <li><strong className="text-foreground font-medium">Service Providers:</strong> Your data may be temporarily processed by secure third-party platforms we use to manage our business (such as Google Calendar for booking dates, or Resend for confirmation emails), but only for the purpose of fulfilling your booking.</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground pt-4">4. Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, or to ask us to correct or delete it. To do so, simply contact us via WhatsApp.
            </p>

            <h2 className="text-xl font-medium text-foreground pt-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us directly via WhatsApp at our provided business number.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
