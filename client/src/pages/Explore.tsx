import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Destination } from "@/lib/types";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Globe, Search, MapPin, Star, Filter, 
  Check, Plane, Clock, ArrowRight
} from "lucide-react";

export default function Explore() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Get all destinations
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ['/api/recommended-destinations'],
  });
  
  // Filter destinations based on search and filters
  const filteredDestinations = destinations?.filter(destination => {
    // Apply search term filter
    const matchesSearch = searchTerm === "" || 
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply category filter
    let matchesFilter = true;
    if (activeFilter === "halal") {
      matchesFilter = destination.muslimFriendly.halal;
    } else if (activeFilter === "prayer") {
      matchesFilter = destination.muslimFriendly.prayer;
    } else if (activeFilter === "privacy") {
      matchesFilter = destination.muslimFriendly.privacy;
    } else if (activeFilter === "beach") {
      matchesFilter = destination.attractions?.includes("beaches");
    } else if (activeFilter === "shopping") {
      matchesFilter = destination.attractions?.includes("shopping");
    } else if (activeFilter === "history") {
      matchesFilter = destination.attractions?.includes("historical");
    }
    
    return matchesSearch && matchesFilter;
  }) || [];
  
  // Group destinations by continent
  const destinationsByContinent: Record<string, Destination[]> = {};
  
  filteredDestinations.forEach(destination => {
    const continent = destination.continent || "Other";
    if (!destinationsByContinent[continent]) {
      destinationsByContinent[continent] = [];
    }
    destinationsByContinent[continent].push(destination);
  });
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading destinations...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Explore Muslim-Friendly Destinations</h1>
      
      {/* Search and filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search destinations or countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeFilter === "halal" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick("halal")}
              className="flex items-center"
            >
              {activeFilter === "halal" && <Check className="mr-1 h-4 w-4" />}
              Halal Food
            </Button>
            
            <Button 
              variant={activeFilter === "prayer" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick("prayer")}
              className="flex items-center"
            >
              {activeFilter === "prayer" && <Check className="mr-1 h-4 w-4" />}
              Prayer Facilities
            </Button>
            
            <Button 
              variant={activeFilter === "privacy" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick("privacy")}
              className="flex items-center"
            >
              {activeFilter === "privacy" && <Check className="mr-1 h-4 w-4" />}
              Privacy Options
            </Button>
            
            <Button 
              variant={activeFilter === "beach" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick("beach")}
              className="flex items-center"
            >
              {activeFilter === "beach" && <Check className="mr-1 h-4 w-4" />}
              Beaches
            </Button>
            
            <Button 
              variant={activeFilter === "shopping" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick("shopping")}
              className="flex items-center"
            >
              {activeFilter === "shopping" && <Check className="mr-1 h-4 w-4" />}
              Shopping
            </Button>
            
            <Button 
              variant={activeFilter === "history" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick("history")}
              className="flex items-center"
            >
              {activeFilter === "history" && <Check className="mr-1 h-4 w-4" />}
              Historical Sites
            </Button>
          </div>
        </div>
      </div>
      
      {/* Display results */}
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-xl font-medium mb-2">No destinations found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filters to find more destinations.
          </p>
          {activeFilter && (
            <Button variant="outline" onClick={() => setActiveFilter(null)}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(destinationsByContinent).map(continent => (
            <div key={continent}>
              <div className="flex items-center mb-4">
                <Globe className="mr-2 h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{continent}</h2>
                <Separator className="ml-4 flex-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinationsByContinent[continent].map(destination => (
                  <Card key={destination.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={destination.imageUrl || "https://placehold.co/600x400/purple/white?text=Destination"} 
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 p-3 bg-black/30 backdrop-blur-sm w-full">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-white">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">{destination.country}</span>
                          </div>
                          <div className="flex items-center text-white bg-yellow-500/80 rounded-full px-2 py-0.5">
                            <Star className="h-3 w-3 mr-1" />
                            <span className="text-xs font-bold">{destination.rating || 4.5}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle>{destination.name}</CardTitle>
                      <CardDescription>
                        Best Season: {destination.bestSeason}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {destination.muslimFriendly.halal && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Halal Food
                          </span>
                        )}
                        {destination.muslimFriendly.prayer && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Prayer Facilities
                          </span>
                        )}
                        {destination.muslimFriendly.privacy && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            Privacy Options
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Plane className="h-4 w-4 mr-1" />
                          <span>{destination.flightTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Visa: {destination.visaStatus}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/destination/${destination.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
