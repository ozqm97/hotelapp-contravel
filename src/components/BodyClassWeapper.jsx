'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function BodyClassWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/login') {
      document.body.style.background = 'linear-gradient(to bottom right,#0170ab 30%,#fff)'; // azul
    } else {
      document.body.style.background = ''; // valor por defecto
    }
  }, [pathname]);

  return children;
}