// components/StoreProvider.tsx
'use client'; // This directive makes it a Client Component

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/redux/store'; // Adjust path based on your project

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Corrected: Initialize useRef with null, and explicitly type it to allow null
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this component renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}