'use client';

import { useEffect } from 'react';
import { segment } from '@utils';
import { usePathname } from 'next/navigation';

// I really don't care if you can see my writeKey publicly lol

export default function useVisitorTracker() {
  const pathname = usePathname();
  useEffect(() => {
    segment.track('page_view');
  }, [pathname]);
}

