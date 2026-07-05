import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
            Cancellation and Refund Policy
          </h1>
          
          <div className="text-muted-foreground text-sm md:text-base leading-relaxed space-y-6">
            <p>
              We understand that plans can change. To keep things fair for both our guests and our business, we enforce the following cancellation policy.
            </p>

            <h2 className="text-xl font-medium text-foreground pt-4">1. Standard Cancellation</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Full Refund:</strong> Guests may cancel their reservation and receive a 100% refund of any deposit/payment if the cancellation is made at least <strong className="text-foreground font-medium">7 days</strong> prior to the scheduled check-in date.</li>
              <li><strong className="text-foreground font-medium">Partial Refund (50%):</strong> If a cancellation is made between <strong className="text-foreground font-medium">3 to 6 days</strong> prior to the check-in date, a 50% refund will be issued.</li>
              <li><strong className="text-foreground font-medium">No Refund:</strong> Cancellations made <strong className="text-foreground font-medium">less than 48 hours</strong> before the check-in time, or "no-shows," are not eligible for any refund.</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground pt-4">2. Refund Processing</h2>
            <p>Since payments are handled manually via Bank Transfer or Touch 'n Go eWallet:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Approved refunds will be processed manually by the owner.</li>
              <li>Please provide your preferred bank account or TNG eWallet details when requesting a refund.</li>
              <li>Refunds will typically be transferred within <strong className="text-foreground font-medium">2 to 3 business days</strong> of the cancellation approval.</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground pt-4">3. Date Modifications</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Requests to modify booking dates are subject to availability.</li>
              <li>If you need to change your dates, please inform us at least <strong className="text-foreground font-medium">5 days</strong> in advance. We will do our best to accommodate your request without additional penalties, though price differences between weekdays and weekends may apply.</li>
            </ul>

            <p className="italic pt-4 text-xs">
              *This policy is a standard baseline and can be adjusted based on the host's specific preferences.*
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
