'use client'
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/lib/loading-context';

export default function GlobalLoadingHandler() {
  const pathname = usePathname();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, [pathname, setLoading]);

  return null;
} 