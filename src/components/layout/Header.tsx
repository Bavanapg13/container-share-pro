import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Ship, Package, MessageSquare, User, LogOut } from 'lucide-react';

interface HeaderProps {
  isLoggedIn?: boolean;
  userRole?: 'trader' | 'provider' | 'admin';
  onLogout?: () => void;
}

export function Header({ isLoggedIn = false, userRole, onLogout }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isLandingPage = location.pathname === '/';

  const navLinks = isLoggedIn
    ? [
        { href: '/marketplace', label: 'Marketplace', icon: Package },
        { href: '/bookings', label: 'My Bookings', icon: Ship },
        { href: '/messages', label: 'Messages', icon: MessageSquare },
        { href: '/profile', label: 'Profile', icon: User },
      ]
    : [
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'How It Works' },
        { href: '#pricing', label: 'Pricing' },
      ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLandingPage ? 'bg-transparent' : 'bg-background/80 backdrop-blur-xl border-b border-border'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center">
              <Ship className={`w-6 h-6 ${isLandingPage ? 'text-primary-foreground' : 'text-primary-foreground'}`} />
            </div>
            <span className={`font-display font-bold text-xl ${isLandingPage ? 'text-primary-foreground' : 'text-foreground'}`}>
              CargoSpace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isLandingPage ? 'text-primary-foreground/80 hover:text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <Button variant={isLandingPage ? 'heroOutline' : 'outline'} onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant={isLandingPage ? 'heroOutline' : 'ghost'}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant={isLandingPage ? 'hero' : 'default'}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className={isLandingPage ? 'text-primary-foreground' : ''}>
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                  >
                    {'icon' in link && link.icon && <link.icon className="w-5 h-5" />}
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4">
                  {isLoggedIn ? (
                    <Button variant="outline" className="w-full" onClick={onLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">Sign In</Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">Get Started</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
