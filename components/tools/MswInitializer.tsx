"use client";

import { useEffect, useState } from 'react';

export function MswInitializer({ children }: { children: React.ReactNode }) {
  const [mswInitialized, setMswInitialized] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true' && typeof window !== 'undefined') {
        console.log('[MSW Initializer Component] Detected mock mode, initializing MSW for browser...');
        // Dynamically import initMsw to ensure it's client-side
        const { initMsw } = await import('@/app/lib/msw');
        await initMsw();
        setMswInitialized(true);
        console.log('[MSW Initializer Component] MSW initialized for browser.');
      } else {
        // If not in mock mode, or not in browser, mark as "initialized" to render children
        setMswInitialized(true);
      }
    }
    initialize();
  }, []);

  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true' && !mswInitialized) {
    // console.log('[MSW Initializer Component] Waiting for MSW to initialize...');
    return null; // Return null or a loading spinner while MSW is initializing
  }

  return <>{children}</>;
}
