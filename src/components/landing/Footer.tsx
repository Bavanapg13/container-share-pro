import { Link } from 'react-router-dom';
import { Ship, Twitter, Linkedin, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center">
                <Ship className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">CargoSpace</span>
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              The marketplace for cargo space. Connect traders with logistics providers worldwide.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li><Link to="/marketplace" className="hover:text-primary-foreground transition-colors">Marketplace</Link></li>
              <li><Link to="/register?type=trader" className="hover:text-primary-foreground transition-colors">For Traders</Link></li>
              <li><Link to="/register?type=provider" className="hover:text-primary-foreground transition-colors">For Providers</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/40">
            © 2024 CargoSpace. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/40">
            <span>🌍 Available in 50+ countries</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
