import { Features } from "../components/Features";
import { Testimonials } from "../components/Testimonials";
import { LeadForm } from "../components/LeadForm";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <LeadForm />
      <Features />
      <Testimonials />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
