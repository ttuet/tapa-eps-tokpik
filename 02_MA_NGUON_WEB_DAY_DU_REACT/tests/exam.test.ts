import { describe, expect, it } from "vitest";

import type { Question } from "../types/learning";
import {
  calculateScore,
  formatTime,
  getExamRules,
  isPassing,
} from "../lib/exam";

const questions: Question[] = [
  {
    id: "sample-1",
    kind: "reading",
    label: "Sample question one",
    options: ["A", "B", "C", "D"],
    answerIndex: 1,
    explanation: "A neutral explanation.",
  },
  {
    id: "sample-2",
    kind: "reading",
    label: "Sample question two",
    options: ["A", "B", "C", "D"],
    answerIndex: 3,
    explanation: "A neutral explanation.",
  },
];

describe("calculateScore", () => {
  it("awards five points for each correct answer and zero for incorrect or unanswered questions", () => {
    expect(calculateScore(questions, { "sample-1": 1, "sample-2": 0 })).toBe(5);
    expect(calculateScore(questions, { "sample-1": 1 })).toBe(5);
  });
});

describe("combined exam rules", () => {
  it("uses 40 questions, 3,000 seconds, a 200-point maximum, and a 150-point passing threshold", () => {
    expect(getExamRules("combined")).toEqual({
      questionCount: 40,
      durationSeconds: 3000,
      maximumScore: 200,
      passingScore: 150,
    });
    expect(isPassing(150, "combined")).toBe(true);
    expect(isPassing(149, "combined")).toBe(false);
  });
});

describe("formatTime", () => {
  it("formats seconds as zero-padded minutes and seconds", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(1500)).toBe("25:00");
  });
});
