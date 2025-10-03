'use client';

import { initializeMockData } from '@/lib/services/mockData';
import { useEffect } from 'react';

export function DataInitializer() {
  useEffect(() => {
    initializeMockData();
  }, []);
  
  return null;
}
