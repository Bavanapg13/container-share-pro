import { UserPlus, Search, CreditCard, Truck } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up as a trader or logistics provider. Traders get instant access; providers undergo quality verification.',
  },
  {
    icon: Search,
    title: 'Find Space',
    description: 'Browse available container spaces by route, date, and transport mode. Filter by price and capacity.',
  },
  {
    icon: CreditCard,
    title: 'Book & Pay',
    description: 'Reserve your space with one click and pay securely online. Get instant confirmation.',
  },
  {
    icon: Truck,
    title: 'Ship & Track',
    description: 'Coordinate with your provider via chat. Track your shipment from pickup to delivery.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">How It Works</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Simple Process, Powerful Results
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in minutes. Our streamlined process makes cargo booking effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                {/* Step Number */}
                <div className="relative inline-flex">
                  <div className="w-24 h-24 rounded-full bg-card border-4 border-background shadow-xl flex items-center justify-center relative z-10">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full accent-gradient flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
