"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MockAuthContextValue = {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

const MockAuthContext = createContext<MockAuthContextValue | null>(null);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const signIn = useCallback(() => setIsSignedIn(true), []);
  const signOut = useCallback(() => setIsSignedIn(false), []);

  const value = useMemo(
    () => ({ isSignedIn, signIn, signOut }),
    [isSignedIn, signIn, signOut],
  );

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const ctx = useContext(MockAuthContext);
  if (!ctx) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return ctx;
}
