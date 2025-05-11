import { User } from "@shared/schema";
import { Check, UtensilsCrossed, Church } from "lucide-react";

interface WelcomeSectionProps {
  user?: User;
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="p-8 md:w-3/5">
            <h1 className="text-2xl md:text-3xl font-poppins font-bold text-white mb-2">
              {user ? `مرحبا ${user.fullName}!` : 'مرحبا بك في وجهتي!'}
            </h1>
            <p className="text-white/90 mb-4">Your personal Bahraini travel assistant</p>
            <p className="text-white/80 text-sm mb-6">
              Let us help you find the perfect destination tailored for Bahraini travelers, 
              with all the essentials you need for a worry-free journey.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center">
                <Check className="text-white mr-2 text-sm h-4 w-4" />
                <span className="text-white text-sm">Visa Requirements</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center">
                <UtensilsCrossed className="text-white mr-2 text-sm h-4 w-4" />
                <span className="text-white text-sm">Halal Food Options</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center">
                <Church className="text-white mr-2 text-sm h-4 w-4" />
                <span className="text-white text-sm">Prayer Facilities</span>
              </div>
            </div>
          </div>
          <div className="md:w-2/5 relative">
            {/* A photo showcasing Bahrain's Manama skyline with traditional elements */}
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ 
                backgroundImage: "url(https://images.unsplash.com/photo-1565623833408-d77e39b88af6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800)" 
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
