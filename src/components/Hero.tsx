import { ArrowRight } from "./Icons";

export function Hero() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight">
              Transform Your Business with Our Solution
            </h1>
            <p className="text-xl text-blue-100">
              Join thousands of companies that have streamlined their operations and increased revenue by up to 300% with our proven platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl">10,000+</div>
                <div className="text-blue-200">Active Users</div>
              </div>
              <div className="h-12 w-px bg-blue-400" />
              <div>
                <div className="text-3xl">4.9/5</div>
                <div className="text-blue-200">Customer Rating</div>
              </div>
              <div className="h-12 w-px bg-blue-400" />
              <div>
                <div className="text-3xl">24/7</div>
                <div className="text-blue-200">Support</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Business collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-xl shadow-xl">
              <div className="text-sm text-gray-600">Monthly Revenue Growth</div>
              <div className="text-3xl text-green-600">+247%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}