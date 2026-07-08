import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
            Terms and Conditions (Booking Policy & House Rules)
          </h1>
          <div className="text-muted-foreground text-sm md:text-base leading-relaxed space-y-6">
              Welcome to <strong className="text-foreground font-medium">RUMA Rivervale</strong>. By booking your stay with us, you agree to the following terms and conditions.

            <h2 className="text-xl font-medium text-foreground pt-4">1. Booking & Payment Policy</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Manual Booking:</strong> All bookings must be confirmed manually via WhatsApp. Your reservation is only secured once we have received the full payment or deposit (as agreed via chat).</li>
              <li><strong className="text-foreground font-medium">Payment Method:</strong> Payments are accepted via Bank Transfer (DuitNow/Online Banking) directly to the owner.</li>
              <li><strong className="text-foreground font-medium">Security Deposit:</strong> A refundable security deposit may be required before check-in. It will be refunded within 24 hours of check-out, provided there are no damages or missing items.</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground pt-4">2. Check-In & Check-Out</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Check-In:</strong> 3:00 PM onwards.</li>
              <li><strong className="text-foreground font-medium">Check-In Method:</strong> Check-in is self-service. Guests will receive an access code via WhatsApp prior to arrival to unlock a lockbox containing the house key.</li>
              <li><strong className="text-foreground font-medium">Check-Out:</strong> 12:00 PM (Noon) strictly.</li>
              <li>Early check-in or late check-out is subject to availability and prior approval. Additional charges may apply.</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground pt-4">3. House Rules</h2>
            <p>To ensure a pleasant stay for everyone, please observe the following rules:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Maximum Capacity:</strong> The property accommodates a maximum of 6 guests + 3 children.</li>
              <li><strong className="text-foreground font-medium">No Smoking:</strong> Smoking is strictly prohibited inside the house. You may smoke in designated outdoor areas only.</li>
              <li><strong className="text-foreground font-medium">No Pets:</strong> Pets are not allowed on the premises.</li>
              <li><strong className="text-foreground font-medium">No Parties/Events:</strong> Quiet hours are from 10:00 PM to 8:00 AM to respect the neighbors.</li>
              <li><strong className="text-foreground font-medium">Cleanliness:</strong> Please leave the house in a reasonably clean condition. Do not leave unwashed dishes or excessive trash.</li>
              <li><strong className="text-foreground font-medium">Security:</strong> Ensure all doors and gates are securely locked when leaving the property.</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground pt-4">4. Safety Disclosures</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Safety Equipment:</strong> Please note that this property does not currently have smoke alarms or carbon monoxide detectors installed. Guests are advised to be mindful of fire and gas safety during their stay.</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground pt-4">5. Liability</h2>
            <p>
              The owner is not responsible for any accidents, injuries, or illnesses that occur while on the premises. The owner is not responsible for the loss of personal belongings or valuables of the guest.
            </p>

            <h2 className="text-xl font-medium text-foreground pt-4">6. Photo & Property Representation</h2>
            <p>
              Photos on this website may be enhanced for lighting and presentation purposes. The property's layout, furnishings, and features are accurately represented. Actual lighting conditions and minor decorative details may vary slightly from photos.
            </p>

            <p className="italic pt-4 text-xs">
              *These terms act as a basic guideline and can be customized further by the host.*
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
