
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Baby, User, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/create/child',
      label: 'Ages 5-10',
      icon: Baby,
      active: pathname === '/create/child',
    },
    {
      href: '/create/teen',
      label: 'Ages 11-17',
      icon: User,
      active: pathname === '/create/teen',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">FutureSelf AI</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  route.active ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Nav */}
        <div className="flex md:hidden w-full justify-center">
            <nav className="flex items-center space-x-4 text-sm font-medium">
                {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                    'flex flex-col items-center gap-1 transition-colors hover:text-foreground/80 p-2 rounded-md',
                    route.active ? 'text-primary bg-primary/10' : 'text-foreground/60'
                    )}
                >
                    <route.icon className="h-5 w-5" />
                    <span>{route.label}</span>
                </Link>
                ))}
            </nav>
        </div>
      </div>
    </header>
  );
}
