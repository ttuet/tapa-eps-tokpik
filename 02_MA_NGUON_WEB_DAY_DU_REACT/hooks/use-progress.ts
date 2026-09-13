"use client";

import { useCallback, useEffect, useState } from "react";

import { defaultBestScores } from "../lib/content";
import type { BestScores, ExamKind } from "../types/learning";

const STORAGE_KEY = "tapa-progress";

function emptyBestScores(): BestScores {
  return { ...defaultBestScores };
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function parseProgress(value: string | null): BestScores {
  if (!value) {
    return emptyBestScores();
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      !("best" in parsed) ||
      parsed.version !== 1 ||
      typeof parsed.best !== "object" ||
      parsed.best === null
    ) {
      return emptyBestScores();
    }

    const { best } = parsed;
    if (
      !("reading" in best) ||
      !("listening" in best) ||
      !("combined" in best) ||
      !isScore(best.reading) ||
      !isScore(best.listening) ||
      !isScore(best.combined)
    ) {
      return emptyBestScores();
    }

    return { reading: best.reading, listening: best.listening, combined: best.combined };
  } catch {
    return emptyBestScores();
  }
}

export function useProgress() {
  const [best, setBest] = useState<BestScores>(emptyBestScores);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let savedProgress = emptyBestScores();

    try {
      savedProgress = parseProgress(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      savedProgress = emptyBestScores();
    }

    queueMicrotask(() => {
      if (isMounted) {
        setBest(savedProgress);
        setHasMounted(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, best }));
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }
  }, [best, hasMounted]);

  const recordScore = useCallback((kind: ExamKind, score: number) => {
    if (!isScore(score)) {
      return;
    }

    setBest((current) => ({
      ...current,
      [kind]: Math.max(current[kind], score),
    }));
  }, []);

  return { best, recordScore };
}
