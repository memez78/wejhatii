import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TravelPreferences } from "@/lib/types";
import { TravelPreferencesSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PreferencesFormProps {
  onSubmit: (data: TravelPreferences) => void;
}

export default function PreferencesForm({ onSubmit }: PreferencesFormProps) {
  const { toast } = useToast();
  const [sliderValue, setSliderValue] = useState(1000);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TravelPreferences>({
    resolver: zodResolver(TravelPreferencesSchema),
    defaultValues: {
      budget: 1000,
      companions: "solo",
      muslimRequirements: ["prayer", "strict-halal"],
      revealPreference: "now",
      revealTiming: "7",
    },
  });
  
  const submitMutation = useMutation({
    mutationFn: async (data: TravelPreferences) => {
      return await apiRequest("POST", "/api/travel-preferences", data);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      onSubmit(data);
      toast({
        title: "Preferences saved",
        description: "We're finding your perfect destination!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onFormSubmit = (data: TravelPreferences) => {
    submitMutation.mutate(data);
  };
  
  const interestOptions = [
    { value: "cultural", label: "Cultural", icon: "museum" },
    { value: "historical", label: "Historical", icon: "landmark" },
    { value: "relaxation", label: "Relaxation", icon: "umbrella-beach" },
    { value: "shopping", label: "Shopping", icon: "shopping-bag" },
    { value: "food", label: "Food", icon: "utensils" },
    { value: "nature", label: "Nature", icon: "tree" },
    { value: "adventure", label: "Adventure", icon: "mountain" },
    { value: "nightlife", label: "Nightlife", icon: "moon" },
  ];
  
  const muslimRequirementOptions = [
    { value: "prayer", label: "Prayer Facilities", icon: "mosque" },
    { value: "strict-halal", label: "Strict Halal Food", icon: "utensils" },
    { value: "vegetarian", label: "Vegetarian Options", icon: "leaf" },
    { value: "privacy", label: "Privacy Options", icon: "eye-slash" },
  ];
  
  return (
    <section className="mb-10 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-poppins font-semibold mb-6 text-gray-800">Find Your Perfect Destination</h2>
      <p className="text-gray-600 mb-6">
        Tell us what you're looking for and we'll suggest the ideal destination for your Bahraini passport.
      </p>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Budget Range */}
        <div className="space-y-2">
          <Label htmlFor="budget">Travel Budget (BHD)</Label>
          <div className="flex items-center space-x-3">
            <Controller
              name="budget"
              control={control}
              render={({ field }) => (
                <Slider
                  id="budget"
                  min={200}
                  max={10000}
                  step={100}
                  value={[field.value]}
                  onValueChange={(vals) => {
                    field.onChange(vals[0]);
                    setSliderValue(vals[0]);
                  }}
                  className="w-full"
                />
              )}
            />
            <span className="bg-primary text-white px-3 py-1 rounded-full min-w-16 text-center">
              {sliderValue} BHD
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 px-1">
            <span>200 BHD</span>
            <span>10000 BHD</span>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className="mb-1 block">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              {...register("startDate")}
              className="w-full p-3"
            />
          </div>
          <div>
            <Label htmlFor="endDate" className="mb-1 block">End Date</Label>
            <Input
              type="date"
              id="endDate"
              {...register("endDate")}
              className="w-full p-3"
            />
          </div>
        </div>

        {/* Interests */}
        <div>
          <Label className="mb-2 block">Interests</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Controller
              name="interests"
              control={control}
              render={({ field }) => (
                <>
                  {interestOptions.map((option) => (
                    <label 
                      key={option.value}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-primary/5 transition group"
                    >
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, option.value]);
                          } else {
                            field.onChange(currentValues.filter((value) => value !== option.value));
                          }
                        }}
                      />
                      <span className="ml-2 mr-1 text-gray-500 group-hover:text-primary">{option.icon}</span>
                      <span className="text-gray-700 group-hover:text-primary">{option.label}</span>
                    </label>
                  ))}
                </>
              )}
            />
          </div>
        </div>

        {/* Companions */}
        <div>
          <Label className="mb-2 block">Travel Companions</Label>
          <Controller
            name="companions"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
              >
                <div className="relative">
                  <RadioGroupItem value="solo" id="companion-solo" className="sr-only peer" />
                  <label 
                    htmlFor="companion-solo"
                    className="border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer transition peer-checked:border-primary peer-checked:bg-primary/5 block"
                  >
                    <span className="material-icons block mx-auto mb-2 text-gray-500 peer-checked:text-primary">person</span>
                    <span className="font-medium text-gray-700 peer-checked:text-primary">Solo Travel</span>
                  </label>
                </div>
                
                <div className="relative">
                  <RadioGroupItem value="couple" id="companion-couple" className="sr-only peer" />
                  <label 
                    htmlFor="companion-couple"
                    className="border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer transition peer-checked:border-primary peer-checked:bg-primary/5 block"
                  >
                    <span className="material-icons block mx-auto mb-2 text-gray-500 peer-checked:text-primary">people</span>
                    <span className="font-medium text-gray-700 peer-checked:text-primary">Couple</span>
                  </label>
                </div>
                
                <div className="relative">
                  <RadioGroupItem value="family" id="companion-family" className="sr-only peer" />
                  <label 
                    htmlFor="companion-family"
                    className="border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer transition peer-checked:border-primary peer-checked:bg-primary/5 block"
                  >
                    <span className="material-icons block mx-auto mb-2 text-gray-500 peer-checked:text-primary">family_restroom</span>
                    <span className="font-medium text-gray-700 peer-checked:text-primary">Family</span>
                  </label>
                </div>
                
                <div className="relative">
                  <RadioGroupItem value="friends" id="companion-friends" className="sr-only peer" />
                  <label 
                    htmlFor="companion-friends"
                    className="border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer transition peer-checked:border-primary peer-checked:bg-primary/5 block"
                  >
                    <span className="material-icons block mx-auto mb-2 text-gray-500 peer-checked:text-primary">groups</span>
                    <span className="font-medium text-gray-700 peer-checked:text-primary">Friends</span>
                  </label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        {/* Muslim Requirements */}
        <div>
          <Label className="mb-2 block">Muslim Travel Requirements</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Controller
              name="muslimRequirements"
              control={control}
              render={({ field }) => (
                <>
                  {muslimRequirementOptions.map((option) => (
                    <label 
                      key={option.value}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-primary/5 transition"
                    >
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, option.value]);
                          } else {
                            field.onChange(currentValues.filter((value) => value !== option.value));
                          }
                        }}
                      />
                      <span className="material-icons ml-2 mr-1 text-gray-500">{option.icon}</span>
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </>
              )}
            />
          </div>
        </div>

        {/* Reveal Preference */}
        <div>
          <Label className="mb-2 block">How would you like to receive your destination?</Label>
          <Controller
            name="revealPreference"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="relative">
                  <RadioGroupItem value="now" id="reveal-now" className="sr-only peer" />
                  <label 
                    htmlFor="reveal-now"
                    className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition peer-checked:border-primary peer-checked:bg-primary/5 block"
                  >
                    <div className="flex items-center mb-2">
                      <span className="material-icons text-gray-500 peer-checked:text-primary mr-2">bolt</span>
                      <span className="font-medium text-gray-700 peer-checked:text-primary">Reveal Now</span>
                    </div>
                    <p className="text-sm text-gray-500">Show me my destination immediately after submitting</p>
                  </label>
                </div>
                
                <div className="relative">
                  <RadioGroupItem value="later" id="reveal-later" className="sr-only peer" />
                  <label 
                    htmlFor="reveal-later"
                    className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition peer-checked:border-primary peer-checked:bg-primary/5 block"
                  >
                    <div className="flex items-center mb-2">
                      <span className="material-icons text-gray-500 peer-checked:text-primary mr-2">schedule</span>
                      <span className="font-medium text-gray-700 peer-checked:text-primary">Surprise Me</span>
                    </div>
                    <p className="text-sm text-gray-500">Keep it as a surprise until closer to my trip</p>
                  </label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full py-3 px-4" 
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Your Destination...
              </>
            ) : (
              <>
                <span className="material-icons mr-2">search</span>
                Find My Destination
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
