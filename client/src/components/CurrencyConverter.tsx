import { useState, useEffect } from "react";
import { Destination } from "@/lib/types";
import { Calculator, RefreshCw, 
  UtensilsCrossed, Bus, Hotel, Ticket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CurrencyConverterProps {
  destination: Destination;
  budget: number;
}

export default function CurrencyConverter({ destination, budget }: CurrencyConverterProps) {
  const [amountBHD, setAmountBHD] = useState(1);
  const [amountForeign, setAmountForeign] = useState(destination.exchangeRate);
  
  // Calculate budget estimates
  const accommodation = {
    min: Math.round(destination.costIndicators.hotel.min * 7),
    max: Math.round(destination.costIndicators.hotel.max * 7)
  };
  
  const food = {
    min: Math.round(destination.costIndicators.meal.min * 3 * 7), // 3 meals a day for 7 days
    max: Math.round(destination.costIndicators.meal.max * 3 * 7)
  };
  
  const transportation = {
    min: Math.round(destination.costIndicators.transport.min * 2 * 7), // 2 trips a day for 7 days
    max: Math.round(destination.costIndicators.transport.max * 2 * 7)
  };
  
  const attractions = {
    min: Math.round(destination.costIndicators.attraction.min * 7), // 1 attraction per day
    max: Math.round(destination.costIndicators.attraction.max * 7)
  };
  
  const shopping = {
    min: Math.round(budget * 0.1), // 10% of budget
    max: Math.round(budget * 0.2) // 20% of budget
  };
  
  const totalMin = accommodation.min + food.min + transportation.min + attractions.min + shopping.min;
  const totalMax = accommodation.max + food.max + transportation.max + attractions.max + shopping.max;
  
  const handleBHDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setAmountBHD(value);
      setAmountForeign(Math.round(value * destination.exchangeRate * 100) / 100);
    }
  };
  
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-poppins font-semibold mb-4 text-gray-800">Budget Planning</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Calculator className="text-primary h-5 w-5" />
          </div>
          <h3 className="font-medium text-gray-800">Your Budget: {budget} BHD</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Currency Converter</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex shadow-sm rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">From</div>
                  <div className="flex items-center">
                    <span className="font-medium">BHD</span>
                    <RefreshCw className="mx-2 h-4 w-4 text-gray-400" />
                    <span className="font-medium">{destination.currencyCode}</span>
                  </div>
                </div>
                <Input
                  type="number"
                  value={amountBHD}
                  onChange={handleBHDChange}
                  min="1"
                  className="flex-1 p-3 border-l-0"
                />
                <div className="bg-primary text-white p-3 flex items-center">
                  <span className="font-medium">≈ {amountForeign.toFixed(2)} {destination.currencyCode}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Current exchange rate: 1 BHD = {destination.exchangeRate} {destination.currencyCode}</p>
                <p>Rate updated: Today</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Cost Indicators</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <UtensilsCrossed className="text-gray-500 mr-2 h-4 w-4" />
                  <span>Restaurant meal</span>
                </div>
                <div className="text-right">
                  <span className="block font-medium">
                    {destination.costIndicators.meal.min}-{destination.costIndicators.meal.max} BHD
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(destination.costIndicators.meal.min * destination.exchangeRate)}-
                    {Math.round(destination.costIndicators.meal.max * destination.exchangeRate)} {destination.currencyCode}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Bus className="text-gray-500 mr-2 h-4 w-4" />
                  <span>Public transport (day)</span>
                </div>
                <div className="text-right">
                  <span className="block font-medium">
                    {destination.costIndicators.transport.min}-{destination.costIndicators.transport.max} BHD
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(destination.costIndicators.transport.min * destination.exchangeRate)}-
                    {Math.round(destination.costIndicators.transport.max * destination.exchangeRate)} {destination.currencyCode}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Hotel className="text-gray-500 mr-2 h-4 w-4" />
                  <span>Mid-range hotel</span>
                </div>
                <div className="text-right">
                  <span className="block font-medium">
                    {destination.costIndicators.hotel.min}-{destination.costIndicators.hotel.max} BHD
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(destination.costIndicators.hotel.min * destination.exchangeRate)}-
                    {Math.round(destination.costIndicators.hotel.max * destination.exchangeRate)} {destination.currencyCode}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Ticket className="text-gray-500 mr-2 h-4 w-4" />
                  <span>Museum/Attraction</span>
                </div>
                <div className="text-right">
                  <span className="block font-medium">
                    {destination.costIndicators.attraction.min}-{destination.costIndicators.attraction.max} BHD
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(destination.costIndicators.attraction.min * destination.exchangeRate)}-
                    {Math.round(destination.costIndicators.attraction.max * destination.exchangeRate)} {destination.currencyCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Budget Estimate (7 days)</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Accommodation</span>
              <span className="font-medium">{accommodation.min}-{accommodation.max} BHD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Food & Drinks</span>
              <span className="font-medium">{food.min}-{food.max} BHD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transportation</span>
              <span className="font-medium">{transportation.min}-{transportation.max} BHD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Attractions & Activities</span>
              <span className="font-medium">{attractions.min}-{attractions.max} BHD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shopping & Extras</span>
              <span className="font-medium">{shopping.min}-{shopping.max} BHD</span>
            </div>
            <div className="border-t border-gray-300 my-2 pt-2 flex justify-between">
              <span className="font-medium text-gray-700">Total Estimate</span>
              <span className="font-semibold text-primary">{totalMin}-{totalMax} BHD</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {budget > totalMax 
              ? `Your budget of ${budget} BHD is more than sufficient for a comfortable trip.` 
              : budget > totalMin 
                ? `Your budget of ${budget} BHD should be sufficient for your trip.`
                : `Your budget of ${budget} BHD might be tight for this destination.`
            }
          </p>
        </div>
      </div>
    </section>
  );
}
