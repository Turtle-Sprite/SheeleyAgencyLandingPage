import { Zap, Shield, TrendingUp } from "./Icons";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const features = [
  {
    icon: Zap,
    title: "Home Owner's Insurance",
    description: "Make sure your most important assets are covered with insurance you can trust and local agents that know how to answer your questions.",
    image: "https://images.unsplash.com/photo-1744782351841-9cc6b86a5add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGluc3VyYW5jZSUyMGhvbWV8ZW58MXx8fHwxNzY0NTM4MDA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: Shield,
    title: "Renter's Insurance",
    description: "Protect your personal belongings and get liability coverage with affordable renter's insurance from trusted local agents.",
    image: "https://images.unsplash.com/photo-1755855877668-e66f4317fb2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjByZW50ZXJzJTIwaW5zdXJhbmNlfGVufDF8fHx8MTc2NDUzODI0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: TrendingUp,
    title: "Auto Insurance",
    description: "Get comprehensive auto insurance coverage with competitive rates and personalized service from agents who care about your safety.",
    image: "https://images.unsplash.com/photo-1759509326921-4ac86913cc99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBhdXRvJTIwaW5zdXJhbmNlfGVufDF8fHx8MTc2NDUzODI0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
];

export function Features() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 font-bold">
            Save up to 50% on Your Quote Today with Bundling!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                {feature.image ? (
                  <>
                    <ImageWithFallback
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-slate-900" />
                    </div>
                    <h3 className="text-xl mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}