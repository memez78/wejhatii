import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import WelcomeSection from "@/components/WelcomeSection";
import PreferencesForm from "@/components/PreferencesForm";
import DestinationReveal from "@/components/DestinationReveal";
import TripDetails from "@/components/TripDetails";
import DocumentChecklist from "@/components/DocumentChecklist";
import CurrencyConverter from "@/components/CurrencyConverter";
import RecommendedDestinations from "@/components/RecommendedDestinations";
import { User, TravelPreferencesSchema } from "@shared/schema";
import { Destination, TravelPreferences } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface HomeProps {
  editMode?: boolean;
  tripId?: string;
}

export default function Home({ editMode = false, tripId }: HomeProps) {
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  const [showDestination, setShowDestination] = useState(false);
  const [location] = useLocation();
  const isExplorePage = location === "/explore";
  const { toast } = useToast();
  
  // Fetch user data
  const { data: userData } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  // Fetch destination data based on preferences
  const { data: destination, isLoading: isDestinationLoading } = useQuery<Destination>({
    queryKey: ["/api/destination", preferences?.id],
    // Enable for both when a preference exists or when we're on the explore page
    enabled: !!preferences?.id || isExplorePage,
  });

  // Load specific travel preferences if in edit mode or active preferences otherwise
  const preferencesQueryKey = editMode && tripId 
    ? [`/api/travel-preferences/${tripId}`] 
    : ["/api/travel-preferences/active"];
    
  const { data: existingPreferences, isLoading: isPreferencesLoading } = useQuery<TravelPreferences>({
    queryKey: preferencesQueryKey,
  });

  // Cancel trip mutation
  const cancelTripMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/travel-preferences/${id}`);
    },
    onSuccess: () => {
      // Reset the state and refetch
      setPreferences(null);
      setShowDestination(false);
      queryClient.invalidateQueries({ queryKey: ["/api/travel-preferences/active"] });
      toast({
        title: "Trip Cancelled",
        description: "Your trip has been cancelled. You can now create a new one.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to cancel trip: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Reveal destination mutation
  const revealDestinationMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("POST", `/api/reveal-destination/${id}`);
    },
    onSuccess: () => {
      setShowDestination(true);
      queryClient.invalidateQueries({ queryKey: ["/api/travel-preferences/active"] });
      toast({
        title: "Destination Revealed!",
        description: "Your surprise destination has been revealed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to reveal destination: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handlePreferencesSubmit = (data: TravelPreferences) => {
    setPreferences(data);
    setShowDestination(data.revealPreference === "now");
  };

  const handleRevealNow = () => {
    if (existingPreferences?.id) {
      // Make sure we're passing a number to the mutation
      revealDestinationMutation.mutate(Number(existingPreferences.id));
    } else {
      setShowDestination(true);
    }
  };

  // Show preferences form on explore page, in edit mode, or when no preferences exist
  const shouldShowPreferencesForm = isExplorePage || editMode || (!preferences && !existingPreferences);
  
  // Set showDestination to true if we have existing preferences that were revealed
  useEffect(() => {
    if (existingPreferences?.revealed) {
      setShowDestination(true);
    }
  }, [existingPreferences]);

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <WelcomeSection user={userData} />

      {isExplorePage && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Explore New Destinations</h2>
          <p className="text-gray-600 mb-6">
            Fill out your travel preferences below and we'll find the perfect Muslim-friendly destination for you.
            Our AI will analyze your budget, interests, and requirements to suggest destinations that meet your needs.
          </p>
        </div>
      )}

      {shouldShowPreferencesForm && (
        <PreferencesForm onSubmit={handlePreferencesSubmit} />
      )}

      {!isExplorePage && (preferences || existingPreferences) && destination && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Trip Plan</h2>
            {userData && existingPreferences?.id && (
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => cancelTripMutation.mutate(Number(existingPreferences.id))}
                  disabled={cancelTripMutation.isPending}
                >
                  {cancelTripMutation.isPending ? 
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cancelling...</> : 
                    'Cancel Trip & Create New'}
                </Button>
                {!isExplorePage && !showDestination && (
                  <Button 
                    onClick={() => handleRevealNow()}
                    disabled={revealDestinationMutation.isPending}
                  >
                    {revealDestinationMutation.isPending ? 
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Revealing...</> : 
                      'Reveal Destination Now'}
                  </Button>
                )}
              </div>
            )}
          </div>

          <DestinationReveal
            destination={destination}
            revealPreference={(preferences || existingPreferences)?.revealPreference || "now"}
            revealTiming={(preferences || existingPreferences)?.revealTiming || "7"}
            travelDate={(preferences || existingPreferences)?.startDate || ""}
            onRevealNow={handleRevealNow}
          />

          {showDestination && (
            <>
              <TripDetails
                destination={destination}
                startDate={(preferences || existingPreferences)?.startDate || ""}
                endDate={(preferences || existingPreferences)?.endDate || ""}
              />
              
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Book Your Trip</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a 
                    href={`https://www.skyscanner.com/transport/flights/bah/${destination.country.substring(0, 3).toLowerCase()}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-50 hover:bg-blue-100 transition rounded-lg p-4 flex flex-col items-center justify-center text-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-blue-600"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>
                    <span className="font-medium">Find Flights</span>
                    <span className="text-xs text-gray-500 mt-1">Skyscanner</span>
                  </a>
                  
                  <a 
                    href={`https://www.booking.com/city/${destination.country.substring(0, 2).toLowerCase()}/${destination.name.toLowerCase().replace(/\s+/g, '-')}.html`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-50 hover:bg-green-100 transition rounded-lg p-4 flex flex-col items-center justify-center text-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-green-600"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M15 6v6"></path><path d="M7 6v6"></path></svg>
                    <span className="font-medium">Book Hotels</span>
                    <span className="text-xs text-gray-500 mt-1">Booking.com</span>
                  </a>
                  
                  <a 
                    href={`https://www.viator.com//${destination.name.toLowerCase().replace(/\s+/g, '-')}/d0`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-orange-50 hover:bg-orange-100 transition rounded-lg p-4 flex flex-col items-center justify-center text-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-orange-600"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                    <span className="font-medium">Explore Activities</span>
                    <span className="text-xs text-gray-500 mt-1">Viator</span>
                  </a>
                </div>
              </div>
              
              <DocumentChecklist destination={destination} />
              <CurrencyConverter
                destination={destination}
                budget={Number((preferences || existingPreferences)?.budget) || 1000}
              />
            </>
          )}
        </>
      )}

      {isDestinationLoading && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Finding your perfect destination...</p>
        </div>
      )}

      {!isExplorePage && (!preferences && !existingPreferences) && (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg shadow-sm my-8">
          <h3 className="text-xl font-bold mb-4">Discover Your Next Adventure</h3>
          <p className="text-center max-w-md mb-6">
            Looking for your next Muslim-friendly travel destination? Let us help you find the perfect place!
          </p>
          <Button asChild size="lg" className="px-8">
            <Link href="/explore">
              Start Exploring
            </Link>
          </Button>
        </div>
      )}

      <RecommendedDestinations />
    </main>
  );
}
