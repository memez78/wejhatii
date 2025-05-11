import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Destination } from "@/lib/types";
import { PartyPopper, Calendar, Download, Gift } from "lucide-react";

interface DestinationRevealProps {
  destination: Destination;
  revealPreference: "now" | "later";
  revealTiming: string;
  travelDate: string;
  onRevealNow: () => void;
}

export default function DestinationReveal({
  destination,
  revealPreference,
  revealTiming,
  travelDate,
  onRevealNow
}: DestinationRevealProps) {
  const [countdownDays, setCountdownDays] = useState<number | null>(null);
  const [showDestination, setShowDestination] = useState(revealPreference === "now");
  
  // Function to download trip data as a PDF or JSON file
  const downloadTripData = (destination: Destination) => {
    const tripData = {
      destination: destination.name,
      country: destination.country,
      flightTime: destination.flightTime,
      bestSeason: destination.bestSeason,
      visaInfo: destination.visaInfo,
      currency: destination.currency,
      exchangeRate: destination.exchangeRate,
      muslimFriendly: destination.muslimFriendly,
      travelDate: travelDate,
      documents: destination.documents || [],
      costIndicators: destination.costIndicators,
      embassy: destination.embassy,
      downloaded: new Date().toISOString()
    };
    
    // Create a JSON string
    const dataStr = JSON.stringify(tripData, null, 2);
    
    // Create a download link
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `trip-plan-${destination.id}-${new Date().toLocaleDateString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    // Calculate days to reveal if it's a surprise
    if (revealPreference === "later" && travelDate) {
      const travelDateObj = new Date(travelDate);
      const now = new Date();
      const revealDate = new Date(travelDateObj);
      revealDate.setDate(travelDateObj.getDate() - parseInt(revealTiming));
      
      // If reveal date is in the future
      if (revealDate > now) {
        const diffTime = Math.abs(revealDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setCountdownDays(diffDays);
      } else {
        // Reveal date has passed
        setShowDestination(true);
      }
    }
  }, [revealPreference, revealTiming, travelDate]);

  return (
    <section className="mb-10 reveal-animation">
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-white mb-4">
            Your Destination Is Ready!
          </h2>
          
          {showDestination && (
            <div className="py-4">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl inline-block mx-auto mb-6">
                <h3 className="text-4xl md:text-5xl font-poppins font-bold text-white tracking-wider mb-2">
                  {destination.name.toUpperCase()}
                </h3>
                <p className="text-white/90 text-xl">{destination.country}</p>
              </div>
              
              <p className="text-white/80 max-w-2xl mx-auto mb-6">
                Perfect for your {destination.muslimFriendly.prayer ? 'Muslim-friendly ' : ''}
                travel with {destination.muslimFriendly.halal ? 'halal dining options ' : ''}
                and a great match for your budget!
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link to={`/destination/${destination.id}`}>
                    View Complete Trip Details
                  </Link>
                </Button>
                
                <Button variant="outline" onClick={() => downloadTripData(destination)} 
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Download className="mr-2 h-4 w-4" />
                  Download Trip Plan
                </Button>
                
                <Button variant="outline" asChild
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Link to="/explore">
                    View Similar Destinations
                  </Link>
                </Button>
              </div>
            </div>
          )}
          
          {!showDestination && (
            <div className="py-4">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl inline-block mx-auto mb-6 surprise-box animate-pulse">
                <div className="relative">
                  <Gift className="text-white h-16 w-16 mx-auto mb-2" />
                  <div className="absolute -top-2 -right-2 bg-primary-dark text-white text-xs rounded-full w-8 h-8 flex items-center justify-center">
                    {countdownDays || "?"}
                  </div>
                </div>
                <h3 className="text-2xl font-poppins font-bold text-white">
                  Your Destination is a Surprise!
                </h3>
                <p className="text-white/80 mt-2">
                  {countdownDays ? (
                    <span>
                      <span className="countdown-timer font-bold">{countdownDays}</span> days until your destination reveal!
                    </span>
                  ) : (
                    <span>We'll reveal it closer to your trip</span>
                  )}
                </p>
              </div>
              
              <p className="text-white/80 max-w-2xl mx-auto mb-6">
                We've found the perfect destination for your preferences. 
                Start getting excited for your adventure!
              </p>
              
              <div className="flex gap-4 justify-center items-center">
                <Button variant="secondary" size="lg" onClick={onRevealNow} className="animate-bounce">
                  <PartyPopper className="mr-2 h-4 w-4" />
                  Reveal Now Instead
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
