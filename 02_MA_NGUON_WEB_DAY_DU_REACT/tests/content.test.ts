import { describe, expect, it } from "vitest";

import {
  listeningPracticeAudio,
  listeningQuestions,
} from "../lib/content";

describe("listening question audio ranges", () => {
  it("uses the authored practice track with positive, ordered ranges inside its duration", () => {
    let previousEnd = 0;

    for (const question of listeningQuestions) {
      const range = question.audioRange;

      expect(range).toBeDefined();
      expect(range?.src).toBe(listeningPracticeAudio.src);
      expect(range?.src).not.toBe("/audio/de-007.mp3");
      expect(range?.startSeconds).toBeGreaterThanOrEqual(previousEnd);
      expect(range?.endSeconds).toBeGreaterThan(range?.startSeconds ?? 0);
      expect(range?.endSeconds).toBeLessThanOrEqual(listeningPracticeAudio.durationSeconds);

      previousEnd = range?.endSeconds ?? previousEnd;
    }
  });
});
