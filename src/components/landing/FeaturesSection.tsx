import { Package, Shield, Zap, MessageSquare, CreditCard, Globe } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Real-Time Availability',
    description: 'View container spaces as they become available. Get instant updates on capacity changes across all transport modes.',
  },
  {
    icon: Shield,
    title: 'Verified Providers',
    description: 'All logistics providers undergo rigorous inspection and verification before approval. Ship with confidence.',
  },
  {
    icon: Zap,
    title: 'Instant Booking',
    description: 'Book available space with one click. No phone calls, no waiting. Secure your shipment instantly.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Communication',
    description: 'Chat directly with logistics providers. Clarify details, negotiate terms, and build lasting partnerships.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Pay securely through our integrated payment gateway. Multiple payment options available.',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Access a worldwide network of carriers. Ship anywhere via road, rail, sea, or air.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Features</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Everything You Need to Ship Smarter
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform brings together traders and logistics providers with powerful tools designed for the modern supply chain.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl accent-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
