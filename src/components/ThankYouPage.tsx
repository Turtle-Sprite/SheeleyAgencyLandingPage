import { CheckCircle2 } from "./Icons";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export function ThankYouPage() {
    const navigate = useNavigate();
    useEffect(() => {
        // Load gtag.js script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-D6SJ8DN3W4';
        document.head.appendChild(script1);
    
        // Initialize gtag
        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date());
          gtag('config', 'G-D6SJ8DN3W4');
        `;
        document.head.appendChild(script2);
    
        // Cleanup function to remove scripts when component unmounts
        return () => {
          document.head.removeChild(script1);
          document.head.removeChild(script2);
        };
      }, []);
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 text-white flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl">Deborah Sheeley Agency</h2>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white text-gray-900 p-8 sm:p-12 rounded-2xl shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl mb-4">Thank You!</h1>
            
            <p className="text-lg text-gray-600 mb-6">
              We're excited to help you find the perfect insurance coverage!
            </p>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl mb-3">What Happens Next?</h2>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>A licensed Pennsylvania agent will review your information</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>You'll receive a call within 24 hours to discuss your options</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <button
              type="button"
                onClick={() => navigate('/')}
                className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
              >
                Return to Home
              </button>
              
              <div className="text-sm text-gray-500">
                Questions? Call us at{" "}
                <a href="tel:724-609-7115" className="text-blue-600 hover:underline font-semibold">
                  724-609-7115
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
