import { Link } from "wouter";
import { Plane, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="text-primary-light" />
              <span className="font-poppins font-bold text-xl">Wejhatii</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your Bahraini travel companion, helping you discover the perfect destinations around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-gray-400 hover:text-white transition">
                  Destinations
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Halal Tourism</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Travel Guides</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Travel Tips</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Partners</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Customer Support</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Wejhatii. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
