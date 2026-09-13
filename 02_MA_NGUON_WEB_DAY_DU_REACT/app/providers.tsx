"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useProgress } from "../hooks/use-progress";

type ProgressValue = ReturnType<typeof useProgress>;

const ProgressContext = createContext<ProgressValue | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  const progress = useProgress();

  return <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>;
}

export function useLearningProgress(): ProgressValue {
  const progress = useContext(ProgressContext);
  if (!progress) {
    throw new Error("useLearningProgress must be used within Providers");
  }
  return progress;
}
