import { Star } from "./Icons";

const testimonials = [
  {
    name: "Pastor B.",
    role: "",
    content: "Debbie has kept in touch with me and keeps me educated about my insurance. She always returns my calls when I call her and leave a message (or answers them directly). She also calls me and checks to see if I need any changes to my insurance. She has told me how to reduce my insurance costs as well. All in all, I am very pleased with her service to me and my family. Thanks Debbie!",
    rating: 5,
  },
  {
    name: "Shannae F.",
    role: "",
    content: "Debbie is an amazing insurance lady. She has been in contact with me through out my entire claim, and is so kind and compassionate, and understanding with all insurance situations. So glad to have her as an agent. She's great at explaining everything and talking to you about the step by step process of everything. Wouldn't want any one else as my agent.",
    rating: 5,
  },
  {
    name: "Ray R.",
    role: "",
    content: "Deborah Sheeley always works hard to find me savings. She is always so friendly and willing to spend whatever time necessary to complete the task. I highly recommend her for all of your insurance needs!",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <div className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4">
            Trusted by people like you
          </h2>
          <p className="text-xl text-gray-600">
            See what our customers have to say about their experience
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index}>
              {index === 0 && (
                <div className="mb-4 text-3xl font-bold text-gray-800 font-serif">
                  We're Committed to Friendly Service
                </div>
              )}
              {index === 1 && (
                <div className="mb-4 text-3xl font-bold text-gray-800 font-serif">
                  We're Claims Experts
                </div>
              )}
              {index === 2 && (
                <div className="mb-4 text-3xl font-bold text-gray-800 font-serif">
                  And most of all, we know how to help you save without cutting coverage
                </div>
              )}
              <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl italic text-gray-700 mb-6">"{testimonial.content}"</p>
                <div>
                  <div>— {testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}