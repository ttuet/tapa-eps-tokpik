import type { ExamKind, ExamRules, Question } from "../types/learning";

export type Answers = Record<string, number | undefined>;

const EXAM_RULES: Record<ExamKind, ExamRules> = {
  reading: {
    questionCount: 20,
    durationSeconds: 1500,
    maximumScore: 100,
    passingScore: 75,
  },
  listening: {
    questionCount: 20,
    durationSeconds: 1500,
    maximumScore: 100,
    passingScore: 75,
  },
  combined: {
    questionCount: 40,
    durationSeconds: 3000,
    maximumScore: 200,
    passingScore: 150,
  },
};

export function calculateScore(questions: Question[], answers: Answers): number {
  return questions.reduce(
    (score, question) => score + (answers[question.id] === question.answerIndex ? 5 : 0),
    0,
  );
}

export function getExamRules(kind: ExamKind): ExamRules {
  return EXAM_RULES[kind];
}

export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function isPassing(score: number, kind: ExamKind): boolean {
  return score >= getExamRules(kind).passingScore;
}
