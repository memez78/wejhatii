// recommendation.ts - No OpenAI dependency
// Smart destination recommendation system based on user preferences

type TravelPreferencesInput = {
  budget: number;
  startDate?: string;
  endDate?: string;
  interests?: string[];
  companions: string;
  muslimRequirements?: string[];
  revealPreference: "now" | "later";
  revealTiming?: string;
};

// Available destinations with matching criteria
const destinationMatching = {
  "istanbul": {
    budget: { min: 400, max: 1200 },
    interests: ["cultural", "historical", "food", "shopping"],
    muslimRequirements: ["prayer", "halal", "alcohol"],
    season: { winter: 2, spring: 8, summer: 9, fall: 8 },  // 1-10 rating
    companions: ["solo", "couple", "family", "friends"],
    flightHours: 3.5
  },
  "kuala-lumpur": {
    budget: { min: 600, max: 1600 },
    interests: ["food", "shopping", "nature", "cultural"],
    muslimRequirements: ["prayer", "halal", "privacy", "alcohol"],
    season: { winter: 7, spring: 6, summer: 7, fall: 7 },
    companions: ["family", "couple", "friends", "solo"],
    flightHours: 7
  },
  "dubai": {
    budget: { min: 800, max: 2500 },
    interests: ["shopping", "relaxation", "cultural"],
    muslimRequirements: ["prayer", "halal", "alcohol"],
    season: { winter: 9, spring: 7, summer: 4, fall: 7 },
    companions: ["family", "couple", "friends"],
    flightHours: 1
  },
  "cairo": {
    budget: { min: 300, max: 1000 },
    interests: ["historical", "cultural", "food"],
    muslimRequirements: ["prayer", "halal"],
    season: { winter: 8, spring: 7, summer: 5, fall: 7 },
    companions: ["solo", "friends", "couple"],
    flightHours: 2.5
  },
  "marrakech": {
    budget: { min: 500, max: 1400 },
    interests: ["cultural", "historical", "shopping", "food"],
    muslimRequirements: ["prayer", "halal"],
    season: { winter: 6, spring: 9, summer: 7, fall: 8 },
    companions: ["couple", "friends", "solo"],
    flightHours: 6
  },
  "maldives": {
    budget: { min: 1000, max: 3000 },
    interests: ["relaxation", "nature"],
    muslimRequirements: ["prayer", "halal", "privacy"],
    season: { winter: 10, spring: 8, summer: 7, fall: 9 },
    companions: ["couple", "family"],
    flightHours: 5
  }
};

// Helper function to determine current season based on date
function getSeason(date?: string): "winter" | "spring" | "summer" | "fall" {
  if (!date) return "summer"; // Default to summer if no date
  
  const month = new Date(date).getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

// Calculate a matching score for a destination based on preferences
function calculateMatchScore(destId: string, preferences: TravelPreferencesInput): number {
  const dest = destinationMatching[destId as keyof typeof destinationMatching];
  let score = 0;
  
  // Budget matching
  if (preferences.budget >= dest.budget.min && preferences.budget <= dest.budget.max) {
    score += 20;
  } else if (preferences.budget >= dest.budget.min * 0.8 && preferences.budget <= dest.budget.max * 1.2) {
    score += 10; // Close to budget range
  }
  
  // Interest matching
  if (preferences.interests && preferences.interests.length > 0) {
    const matchingInterests = preferences.interests.filter(interest => 
      dest.interests.includes(interest)
    );
    score += (matchingInterests.length / preferences.interests.length) * 25;
  }
  
  // Muslim requirements matching
  if (preferences.muslimRequirements && preferences.muslimRequirements.length > 0) {
    const matchingRequirements = preferences.muslimRequirements.filter(req => 
      dest.muslimRequirements.includes(req)
    );
    score += (matchingRequirements.length / preferences.muslimRequirements.length) * 30;
  }
  
  // Season matching based on travel dates
  const season = getSeason(preferences.startDate);
  score += (dest.season[season] / 10) * 15;
  
  // Companions matching
  if (dest.companions.includes(preferences.companions)) {
    const companionIndex = dest.companions.indexOf(preferences.companions);
    score += (dest.companions.length - companionIndex) / dest.companions.length * 10;
  }
  
  return score;
}

export async function generateDestinationRecommendation(
  preferences: TravelPreferencesInput
): Promise<string> {
  try {
    console.log("Generating destination recommendation based on preferences...");
    
    // Calculate scores for all destinations
    const scores: Record<string, number> = {};
    
    for (const destId of Object.keys(destinationMatching)) {
      scores[destId] = calculateMatchScore(destId, preferences);
    }
    
    // Sort destinations by score
    const sortedDestinations = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([id, score]) => ({ id, score }));
    
    console.log("Destination scores:", sortedDestinations);
    
    // Return the highest scoring destination
    return sortedDestinations[0].id;
  } catch (error) {
    console.error("Error generating recommendation:", error);
    // Default fallback
    return "istanbul";
  }
}
