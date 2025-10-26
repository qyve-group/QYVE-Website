'use client';

import React from 'react';

// Minimal Providers component that won't cause rendering issues
export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
