import { Calendar, PlusCircle, TrendingUp, Settings } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function MobileNavigation() {
  const [location] = useLocation();

  const navigation = [
    { name: 'Calendar', href: '/', icon: Calendar, current: location === '/' },
    { name: 'Log', href: '/', icon: PlusCircle, current: false }, // This scrolls to log section
    { name: 'Insights', href: '/insights', icon: TrendingUp, current: location === '/insights' },
    { name: 'Settings', href: '/settings', icon: Settings, current: location === '/settings' },
  ];

  const handleLogClick = () => {
    // Scroll to quick log section if on home page
    if (location === '/') {
      const quickLogElement = document.querySelector('[data-testid="quick-log-section"]');
      quickLogElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center py-2 px-4 ${
              item.current ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={item.name === 'Log' ? handleLogClick : undefined}
            data-testid={`mobile-nav-${item.name.toLowerCase()}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
