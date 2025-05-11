import { Destination } from "@/lib/types";
import { 
  Plane, Sun, Languages, Landmark, Clock, Check, 
  Calendar, PlaneTakeoff, PlaneLanding
} from "lucide-react";
import { format } from "date-fns";

interface TripDetailsProps {
  destination: Destination;
  startDate: string;
  endDate: string;
}

export default function TripDetails({ destination, startDate, endDate }: TripDetailsProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <section className="mb-10">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Destination Image */}
          <div className="md:w-2/5 relative">
            <div 
              className="w-full h-full min-h-[250px] bg-cover bg-center"
              style={{ backgroundImage: `url(${destination.imageUrl})` }}
            ></div>
          </div>
          
          {/* Trip Information */}
          <div className="md:w-3/5 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-1">{destination.name}</h2>
                <p className="text-gray-600">{destination.country}</p>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">{destination.rating}</span>
                <span className="text-gray-500 text-sm ml-1">({destination.reviewCount})</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              {destination.description}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm block">Travel Time</span>
                <div className="flex items-center">
                  <Plane className="text-primary mr-1 h-4 w-4" />
                  <span className="font-medium">{destination.flightTime}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm block">Best Season</span>
                <div className="flex items-center">
                  <Sun className="text-primary mr-1 h-4 w-4" />
                  <span className="font-medium">{destination.bestSeason}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm block">Language</span>
                <div className="flex items-center">
                  <Languages className="text-primary mr-1 h-4 w-4" />
                  <span className="font-medium">{destination.languages.join(", ")}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm block">Local Currency</span>
                <div className="flex items-center">
                  <Landmark className="text-primary mr-1 h-4 w-4" />
                  <span className="font-medium">{destination.currency} ({destination.currencyCode})</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm block">Time Difference</span>
                <div className="flex items-center">
                  <Clock className="text-primary mr-1 h-4 w-4" />
                  <span className="font-medium">{destination.timeDifference}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm block">Visa Status</span>
                <div className="flex items-center">
                  <Check className="text-green-600 mr-1 h-4 w-4" />
                  <span className="font-medium">{destination.visaStatus}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Your Trip Schedule</h3>
              <div className="flex items-center text-gray-700">
                <div className="flex items-center mr-6">
                  <PlaneTakeoff className="text-primary mr-1 h-4 w-4" />
                  <span>{formatDate(startDate)}</span>
                </div>
                <div className="flex items-center">
                  <PlaneLanding className="text-primary mr-1 h-4 w-4" />
                  <span>{formatDate(endDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
