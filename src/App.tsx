
import { useEffect } from "react";
import emailjs from '@emailjs/browser';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ThankYouPage } from "./components/ThankYouPage";


// Call this once at the top level of your app
emailjs.init({
  publicKey: "rI1-t507fnmxRNY3e",
});

// Safe environment variable getter
function getEnvVar(key: string): string {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || '';
    }
  } catch (error) {
    console.warn(`Could not access environment variable: ${key}`, error);
  }
  return '';
}

export default function App() {
  useEffect(() => {
    // Check if script is already loaded
    if (window.google?.maps?.importLibrary) {
      console.log('✅ Google Maps already loaded');
      window.dispatchEvent(new Event('google-maps-loaded'));
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      console.log('⏳ Script tag exists, waiting for load...');
      // Set up a checker for when it loads
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.importLibrary) {
          clearInterval(checkInterval);
          console.log('✅ Google Maps loaded');
          window.dispatchEvent(new Event('google-maps-loaded'));
        }
      }, 100);
      
      return () => clearInterval(checkInterval);
    }
    

    console.log('🔄 Loading Google Maps API script...');



    const script = document.createElement('script');
    const apiKey = getEnvVar('VITE_GOOGLE_MAPS_API_KEY');
    
    if (!apiKey) {
      console.warn('⚠️ Google Maps API key not found in environment variables');
    }
    
    // Use loading=async for best practice (no callback parameter)
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('✅ Google Maps script loaded');
      // Wait a bit for the API to fully initialize
      const checkReady = setInterval(() => {
        if (window.google?.maps?.importLibrary) {
          clearInterval(checkReady);
          console.log('✅ Google Maps API ready');
          window.dispatchEvent(new Event('google-maps-loaded'));
        }
      }, 50);
      
      // Cleanup after 5 seconds if not loaded
      setTimeout(() => clearInterval(checkReady), 5000);
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Google Maps API script:', error);
    };
    
    document.head.appendChild(script);

    return () => {
      // Only remove if it's still a child
      try {
        if (script.parentNode === document.head) {
          document.head.removeChild(script);
        }
      } catch (e) {
        // Ignore removal errors
      }
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </Router>
  );

  }