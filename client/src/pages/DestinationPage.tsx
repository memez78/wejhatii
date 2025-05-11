import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Destination } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Calendar, Globe, Plane, CreditCard, DownloadCloud, 
  Edit, Trash2, ArrowLeft, AlertTriangle, Check, Share2, Star
} from "lucide-react";
import CurrencyConverter from "@/components/CurrencyConverter";
import DocumentChecklist from "@/components/DocumentChecklist";
import TripDetails from "@/components/TripDetails";

export default function DestinationPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Get the destination data
  const { data: destination, isLoading, error } = useQuery<Destination>({
    queryKey: [`/api/destination/${id}`],
  });

  // Get the user's active travel preference
  const { data: activePref } = useQuery({
    queryKey: ['/api/travel-preferences/active'],
  });
  
  // Delete travel preference mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/travel-preferences/${activePref?.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Trip plan deleted",
        description: "Your travel plan has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/travel-preferences/active'] });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to download trip data
  const downloadTripData = () => {
    if (!destination) return;
    
    const tripData = {
      destination: destination.name,
      country: destination.country,
      description: destination.description,
      flightTime: destination.flightTime,
      bestSeason: destination.bestSeason,
      visaInfo: destination.visaInfo,
      currency: destination.currency,
      exchangeRate: destination.exchangeRate,
      muslimFriendly: destination.muslimFriendly,
      startDate: activePref?.startDate,
      endDate: activePref?.endDate,
      documents: destination.documents || [],
      costIndicators: destination.costIndicators,
      embassy: destination.embassy,
      downloaded: new Date().toISOString()
    };
    
    // Create a JSON string
    const dataStr = JSON.stringify(tripData, null, 2);
    
    // Create a download link
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `wejhatii-trip-${destination.id}-${new Date().toLocaleDateString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Trip plan downloaded",
      description: "Your travel itinerary has been downloaded."
    });
  };

  // Handle confirm delete
  const handleDelete = () => {
    if (confirmDelete) {
      deleteMutation.mutate();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // Reset after 3 seconds
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading destination details...</p>
      </div>
    );
  }
  
  if (error || !destination) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Destination Not Found</h2>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find details for this destination.
          </p>
          <Button asChild>
            <Link to="/explore">Browse Other Destinations</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Determine similar destinations based on common attributes
  const similar = [
    { id: "dubai", name: "Dubai" },
    { id: "istanbul", name: "Istanbul" },
    { id: "cairo", name: "Cairo" },
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="px-0">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      {/* Hero section */}
      <div className="relative rounded-xl overflow-hidden h-[300px] mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${destination.imageUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <div className="flex items-center mb-2">
            <Globe className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium opacity-90">{destination.country}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{destination.name}</h1>
          <div className="flex items-center text-sm space-x-4">
            <div className="flex items-center">
              <Plane className="h-4 w-4 mr-1" />
              <span>{destination.flightTime}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Best time: {destination.bestSeason}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400" />
              <span>{destination.rating || "4.5"} ({destination.reviewCount || "120"} reviews)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="default" onClick={downloadTripData}>
          <DownloadCloud className="h-4 w-4 mr-2" />
          Download Trip Plan
        </Button>
        
        <Button variant="outline" asChild>
          <Link to={`/edit-trip/${activePref?.id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Preferences
          </Link>
        </Button>
        
        <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600" 
          onClick={handleDelete}
        >
          {confirmDelete ? (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Confirm Delete?
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Plan
            </>
          )}
        </Button>
        
        <Button variant="ghost">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Trip Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="prose max-w-none">
                <h2>Destination Overview</h2>
                <p>{destination.description}</p>
                
                <h3>Muslim-Friendly Features</h3>
                <ul>
                  {destination.muslimFriendly.prayer && (
                    <li>Prayer facilities readily available</li>
                  )}
                  {destination.muslimFriendly.halal && (
                    <li>Halal food options widely available</li>
                  )}
                  {destination.muslimFriendly.privacy && (
                    <li>Privacy options for families and women</li>
                  )}
                </ul>
                
                <h3>Practical Information</h3>
                <ul>
                  <li><strong>Languages:</strong> {destination.languages?.join(", ") || "English, Arabic"}</li>
                  <li><strong>Currency:</strong> {destination.currency} ({destination.currencyCode})</li>
                  <li><strong>Time Difference:</strong> {destination.timeDifference}</li>
                  <li><strong>Visa Status:</strong> {destination.visaStatus}</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <TripDetails 
                destination={destination} 
                startDate={activePref?.startDate || ""} 
                endDate={activePref?.endDate || ""} 
              />
            </TabsContent>
            
            <TabsContent value="documents">
              <DocumentChecklist destination={destination} />
            </TabsContent>
            
            <TabsContent value="budget">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Budget Planning</h2>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Your Budget</h3>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-primary mr-2" />
                    <span className="text-xl font-semibold">{activePref?.budget || 0} BHD</span>
                  </div>
                </div>
                
                <CurrencyConverter destination={destination} budget={activePref?.budget || 0} />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Typical Costs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">Accommodation</h4>
                      <p className="text-sm text-gray-600">
                        {destination.costIndicators?.hotel?.min || "50"} - {destination.costIndicators?.hotel?.max || "200"} {destination.currencyCode} per night
                      </p>
                    </div>
                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">Meals</h4>
                      <p className="text-sm text-gray-600">
                        {destination.costIndicators?.meal?.min || "5"} - {destination.costIndicators?.meal?.max || "30"} {destination.currencyCode} per meal
                      </p>
                    </div>
                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">Transportation</h4>
                      <p className="text-sm text-gray-600">
                        {destination.costIndicators?.transport?.min || "2"} - {destination.costIndicators?.transport?.max || "15"} {destination.currencyCode} per ride
                      </p>
                    </div>
                    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">Attractions</h4>
                      <p className="text-sm text-gray-600">
                        {destination.costIndicators?.attraction?.min || "10"} - {destination.costIndicators?.attraction?.max || "50"} {destination.currencyCode} per attraction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          {/* Embassy Info */}
          {destination.embassy && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
              <h3 className="text-lg font-medium mb-3">Embassy Information</h3>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Address:</strong> {destination.embassy.address}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Phone:</strong> {destination.embassy.phone}
              </p>
              {destination.embassy.emergency && (
                <p className="text-sm text-gray-700">
                  <strong>Emergency:</strong> {destination.embassy.emergency}
                </p>
              )}
            </div>
          )}
          
          {/* Similar Destinations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
            <h3 className="text-lg font-medium mb-3">Similar Destinations</h3>
            <div className="space-y-3">
              {similar.filter(s => s.id !== destination.id).slice(0, 3).map(dest => (
                <div key={dest.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-primary mr-2" />
                    <span className="text-gray-700">{dest.name}</span>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/destination/${dest.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Travel Tips */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Quick Tips</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-gray-700">Best time to visit is during {destination.bestSeason}</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-gray-700">{destination.visaInfo}</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-gray-700">Keep your passport and a copy of your visa with you</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
