import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Optimize Your Shipping?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
            Join thousands of exporters and logistics providers already saving time and money with CargoSpace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register?type=trader">
              <Button variant="hero" size="xl">
                Start as Trader
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/register?type=provider">
              <Button variant="heroOutline" size="xl">
                Register as Provider
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-primary-foreground/50">
            No credit card required • Free for traders • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
