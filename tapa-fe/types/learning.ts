export type ExamKind = "reading" | "listening" | "combined";

export type QuestionKind = Exclude<ExamKind, "combined">;

export interface AssetImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface AudioRange {
  src: string;
  startSeconds: number;
  endSeconds: number;
  transcript: string;
}

export interface AudioAsset {
  src: string;
  durationSeconds: number;
}

export interface Question {
  id: string;
  kind: QuestionKind;
  label: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  image?: AssetImage;
  audioRange?: AudioRange;
}

export interface Lesson {
  id: string;
  groupId: string;
  label: string;
  description: string;
  order: number;
}

export interface CatalogGroup {
  id: string;
  label: string;
  description: string;
  lessonIds: string[];
}

export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: "guide" | "practice" | "reference";
  image?: AssetImage;
  audioSrc?: string;
}

export interface BestScores {
  reading: number;
  listening: number;
  combined: number;
}

export interface ExamRules {
  questionCount: number;
  durationSeconds: number;
  maximumScore: number;
  passingScore: number;
}
