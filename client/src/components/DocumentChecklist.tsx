import { Destination } from "@/lib/types";
import { FileText, Check, AlertCircle, Info, Building } from "lucide-react";

interface DocumentChecklistProps {
  destination: Destination;
}

export default function DocumentChecklist({ destination }: DocumentChecklistProps) {
  // Helper function to determine icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'required':
        return <div className="bg-green-100 p-1 rounded-full mt-1 mr-3"><Check className="text-green-600 h-4 w-4" /></div>;
      case 'recommended':
        return <div className="bg-yellow-100 p-1 rounded-full mt-1 mr-3"><AlertCircle className="text-yellow-600 h-4 w-4" /></div>;
      case 'info':
        return <div className="bg-gray-100 p-1 rounded-full mt-1 mr-3"><Info className="text-gray-600 h-4 w-4" /></div>;
      default:
        return <div className="bg-gray-100 p-1 rounded-full mt-1 mr-3"><Info className="text-gray-600 h-4 w-4" /></div>;
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-poppins font-semibold mb-4 text-gray-800">
        Travel Documents & Requirements
      </h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <FileText className="text-primary h-5 w-5" />
            </div>
            <h3 className="font-medium text-gray-800">
              For Bahraini Citizens Traveling to {destination.country}
            </h3>
          </div>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
            {destination.visaStatus.includes("Visa-free") ? "Easy Entry" : "Standard Entry"}
          </span>
        </div>
        
        <div className="space-y-4">
          {destination.documents.map((doc, index) => (
            <div key={index} className="flex items-start">
              {getStatusIcon(doc.status)}
              <div>
                <h4 className="font-medium text-gray-800">{doc.name}</h4>
                <p className="text-gray-600 text-sm">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {destination.embassy && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-800 mb-2">Bahrain Embassy in {destination.country}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex">
                <Building className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                <p>{destination.embassy.address}</p>
              </div>
              <p>Phone: {destination.embassy.phone}</p>
              <p>Emergency Contact: {destination.embassy.emergency}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
