'use client';

import { useState, useEffect } from 'react';

export function SiteFooter() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 lg:px-8">
        <p className="text-sm text-muted-foreground">
          {'\u00A9'} {year} Vercel All rights reserved.
        </p>
      </div>
    </footer>
  );
}
