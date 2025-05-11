import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add meta tags for SEO
document.title = "Wejhatii - Bahraini Travel Assistant";
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Find the perfect Muslim-friendly destinations for Bahraini travelers with personalized recommendations, visa requirements, halal food options, and prayer facilities.";
document.head.appendChild(metaDescription);

// Add Open Graph tags
const ogTitle = document.createElement("meta");
ogTitle.property = "og:title";
ogTitle.content = "Wejhatii - Your Bahraini Travel Assistant";
document.head.appendChild(ogTitle);

const ogDescription = document.createElement("meta");
ogDescription.property = "og:description";
ogDescription.content = "Discover Muslim-friendly travel destinations tailored for Bahraini citizens with visa guides, halal food options, and prayer facilities.";
document.head.appendChild(ogDescription);

const ogType = document.createElement("meta");
ogType.property = "og:type";
ogType.content = "website";
document.head.appendChild(ogType);

// Add Google Material Icons
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
link.rel = "stylesheet";
document.head.appendChild(link);

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
