import { useState } from 'react';
import { Flower, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigation = [
    { name: 'Calendar', href: '/', current: location === '/' },
    { name: 'Insights', href: '/insights', current: location === '/insights' },
    { name: 'Settings', href: '/settings', current: location === '/settings' },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border organic-shadow mb-6">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Flower className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Flow Control</h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    item.current
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>
          
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block py-2 px-4 rounded-lg transition-colors ${
                    item.current
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
