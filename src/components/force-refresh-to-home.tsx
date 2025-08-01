
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_KEY = 'mva-futureself-visited';

export function ForceRefreshToHome() {
  const router = useRouter();

  useEffect(() => {
    // Check if a session flag is set. If not, it's the first visit of the session (or a refresh).
    if (!sessionStorage.getItem(SESSION_KEY)) {
      // Set the flag to indicate the user has started a session.
      sessionStorage.setItem(SESSION_KEY, 'true');
      // Redirect to the home page.
      router.push('/');
    }
  }, [router]);

  return null;
}
