"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type LayoutContextType = {
  isBottomNavVisible: boolean;
  setIsBottomNavVisible: (isVisible: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);

  return (
    <LayoutContext.Provider value={{ isBottomNavVisible, setIsBottomNavVisible }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
