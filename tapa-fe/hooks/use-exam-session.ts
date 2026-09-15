"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { listeningQuestions, readingQuestions } from "../lib/content";
import { calculateScore, getExamRules, type Answers } from "../lib/exam";
import type { ExamKind, Question } from "../types/learning";

export type ExamSessionPhase = "idle" | "active" | "transition" | "submitted";

export interface ExamSessionResult {
  kind: ExamKind;
  score: number;
}

export interface UseExamSessionOptions {
  onSubmit?: (result: ExamSessionResult) => void;
}

function questionsFor(kind: ExamKind): Question[] {
  if (kind === "reading") {
    return readingQuestions;
  }
  if (kind === "listening") {
    return listeningQuestions;
  }
  return [...readingQuestions, ...listeningQuestions];
}

export function useExamSession({ onSubmit }: UseExamSessionOptions = {}) {
  const [phase, setPhase] = useState<ExamSessionPhase>("idle");
  const [kind, setKind] = useState<ExamKind | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [result, setResult] = useState<ExamSessionResult | null>(null);
  const submittedRef = useRef(false);

  const questions = useMemo(() => (kind ? questionsFor(kind) : []), [kind]);
  const currentQuestion = questions[currentIndex];

  const start = useCallback((nextKind: ExamKind) => {
    submittedRef.current = false;
    setKind(nextKind);
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setRemainingSeconds(getExamRules(nextKind).durationSeconds);
    setPhase("active");
  }, []);

  const submit = useCallback(() => {
    if (!kind || submittedRef.current) {
      return;
    }

    submittedRef.current = true;
    const nextResult = { kind, score: calculateScore(questions, answers) };
    setResult(nextResult);
    setPhase("submitted");
    onSubmit?.(nextResult);
  }, [answers, kind, onSubmit, questions]);

  useEffect(() => {
    if ((phase !== "active" && phase !== "transition") || remainingSeconds === 0) {
      if ((phase === "active" || phase === "transition") && remainingSeconds === 0) {
        submit();
      }
      return;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [phase, remainingSeconds, submit]);

  const answer = useCallback((questionId: string, answerIndex: number) => {
    if (phase !== "active") {
      return;
    }
    setAnswers((current) => ({ ...current, [questionId]: answerIndex }));
  }, [phase]);

  const previous = useCallback(() => {
    if (phase === "active") {
      setCurrentIndex((index) => Math.max(0, index - 1));
    }
  }, [phase]);

  const next = useCallback(() => {
    if (phase !== "active" || !currentQuestion || answers[currentQuestion.id] === undefined) {
      return;
    }

    if (kind === "combined" && currentIndex === readingQuestions.length - 1) {
      setPhase("transition");
      return;
    }

    if (currentIndex === questions.length - 1) {
      submit();
      return;
    }

    setCurrentIndex((index) => index + 1);
  }, [answers, currentIndex, currentQuestion, kind, phase, questions.length, submit]);

  const enterListening = useCallback(() => {
    if (kind === "combined" && phase === "transition") {
      setCurrentIndex(readingQuestions.length);
      setPhase("active");
    }
  }, [kind, phase]);

  const exit = useCallback(() => {
    submittedRef.current = false;
    setPhase("idle");
    setKind(null);
    setCurrentIndex(0);
    setAnswers({});
    setRemainingSeconds(0);
    setResult(null);
  }, []);

  const retry = useCallback(() => {
    if (kind) {
      start(kind);
    }
  }, [kind, start]);

  return {
    phase,
    kind,
    questions,
    currentQuestion,
    currentIndex,
    answers,
    remainingSeconds,
    result,
    start,
    answer,
    previous,
    next,
    enterListening,
    submit,
    exit,
    retry,
  };
}
