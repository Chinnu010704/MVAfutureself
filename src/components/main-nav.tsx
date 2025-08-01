
'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function MainNav() {

  const handleLogoClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mva-futureself-visited');
    }
  };

  return (
    <header className="absolute top-0 z-50 w-full">
      <div className="container flex h-20 items-center justify-center">
        <Link href="/" className="flex items-center space-x-2" onClick={handleLogoClick}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
                MV
            </div>
            <span className="font-bold text-xl text-white flex items-center">
              MVAFutureSelf
              <Sparkles className="h-5 w-5 text-yellow-300 ml-1.5" />
            </span>
        </Link>
      </div>
    </header>
  );
}
