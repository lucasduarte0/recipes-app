'use client';

import { Home, Plus, Search, UtensilsCrossed, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = {
  left: [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
  ],
  center: {
    icon: Plus,
    label: '',
    href: '/recipes/create',
  },
  right: [
    { icon: UtensilsCrossed, label: 'Recipes', href: '/recipes' },
    { icon: User, label: 'Profile', href: '/profile' },
  ],
} as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex h-16 max-w-md mx-auto">
        {/* Left section */}
        <div className="flex flex-1">
          {navItems.left.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}>
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Center button */}
        <div className="flex items-center justify-center px-2">
          <Link
            href={navItems.center.href}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <navItems.center.icon className="h-6 w-6" />
          </Link>
        </div>

        {/* Right section */}
        <div className="flex flex-1">
          {navItems.right.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}>
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
