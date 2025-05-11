import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Destination } from "@/lib/types";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecommendedDestinations() {
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/recommended-destinations"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!destinations || destinations.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-poppins font-semibold text-gray-800">
          Popular with Bahraini Travelers
        </h2>
        <Link to="/explore" className="text-primary hover:text-primary-dark font-medium text-sm flex items-center">
          View All
          <span className="material-icons ml-1 text-sm">arrow_forward</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div key={destination.id} className="bg-white rounded-xl shadow-md overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition duration-300"
                style={{ backgroundImage: `url(${destination.imageUrl})` }}
              ></div>
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
                {destination.flightTime} flight
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-poppins font-medium text-gray-800">{destination.name}</h3>
                <div className="flex items-center">
                  <Star className="text-yellow-500 h-4 w-4" />
                  <span className="text-sm ml-1">{destination.rating}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-3">{destination.country}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {destination.visaStatus}
                </span>
                {destination.muslimFriendly.halal && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Halal Food</span>
                )}
                {destination.muslimFriendly.prayer && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Prayer Facilities</span>
                )}
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/destination/${destination.id}`}>
                  Explore Destination
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
