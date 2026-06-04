'use client';

import { useEffect, useState } from 'react';
import { navItems, type NavId } from '@/data/nav';

export function useActiveSection(): NavId {
  const [active, setActive] = useState<NavId>('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = visible[0].target.id as NavId;
          if (navItems.some((n) => n.id === id)) {
            setActive(id);
          }
        }
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}
