import { Check, Phone } from 'lucide-react';

export function WhyChooseUs() {
  const reasons = [
    "We're a family-owned agency ready to serve customers with a local office.",
    "You will receive personal attention from the same professional and experienced team each time you call.",
    "We are a full-service agency offering products for all of your needs including life insurance, auto, homeowner's, motorcycle, boat and more! We even offer pet health insurance."
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[#1e3a8a] mb-12 text-5xl">Why Choose Us?</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {reasons.map((reason, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1e3a8a] flex items-center justify-center mt-1">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="text-gray-700 flex-1 text-lg">{reason}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="tel:724-609-7115"
            className="inline-flex items-center gap-2 bg-yellow-500 text-slate-900 px-8 py-4 rounded-lg hover:bg-yellow-600 transition-colors text-lg"
          >
            <Phone className="h-5 w-5" />
            Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}