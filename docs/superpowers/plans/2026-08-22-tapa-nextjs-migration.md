# TAPA EPS-TOPIK Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a runnable, responsive Next.js TAPA EPS-TOPIK learning app that faithfully reproduces the reference HTML's product experience without reusing its bundled code or copying its Korean/Vietnamese word/exercise message data.

**Architecture:** Convert `02_MA_NGUON_WEB_DAY_DU_REACT/` into the standalone Next.js App Router project, retaining the original HTML and beginner source as read-only references. Static catalog/exam metadata lives in typed `lib` modules; a client application shell composes focused UI components and client hooks own persistence, exam timing, and audio lifecycle.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS, Vitest, React Testing Library, JSDOM, ESLint.

---

## File structure

```text
02_MA_NGUON_WEB_DAY_DU_REACT/
  app/
    globals.css                    Global design tokens and responsive styles
    layout.tsx                     Metadata and document shell
    page.tsx                       Server entry rendering the client shell
    providers.tsx                  Client-only application/provider boundary
  components/
    tapa-app.tsx                   High-level view/modal/exam composition
    site-header.tsx                Accessible application navigation
    dashboard.tsx                  Reference-faithful landing dashboard
    library-page.tsx               Vocabulary/grammar catalog with local filtering
    lessons.tsx                    Book selector and lesson grid
    lesson-modal.tsx               Accessible full-screen lesson overlay
    practice-types.tsx             Reading/listening preparation content
    exam-library.tsx               Exam cards and lock status
    exam-session.tsx               Active question, controls, and result screen
    exam-review.tsx                Per-question result review
    paywall-modal.tsx              Accessible display-only Premium modal
  hooks/
    use-progress.ts                SSR-safe best-score persistence
    use-exam-session.ts            Exam reducer, timer, transitions, scoring
    use-listening-audio.ts         Two-pass bounded audio playback
  lib/
    content.ts                     Original typed application catalog and questions
    exam.ts                        Pure scoring, thresholds, and time formatting
  types/
    learning.ts                    Shared domain types
  public/
    images/                        Six copied source images
    audio/de-007.mp3               Copied listening asset
  tests/
    exam.test.ts                   Pure scoring/threshold tests
    progress.test.ts               Storage parsing and persistence tests
    exam-session.test.tsx          Timer, answer, transition, submit behavior
    listening-audio.test.tsx       Two-pass/error/cleanup playback behavior
  package.json
  tsconfig.json
  next.config.ts
  eslint.config.mjs
  vitest.config.ts
```

`TAPA_LUYEN_THI_EPS_TOPIK.html` and `01_BAN_DE_SUA_CO_BAN/` remain untouched. There is no Git repository in the workspace, so each commit step below is conditional: run it only after the project is placed under Git.

### Task 1: Bootstrap the runnable Next.js project

**Files:**
- Modify: `02_MA_NGUON_WEB_DAY_DU_REACT/package.json`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/tsconfig.json`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/next.config.ts`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/eslint.config.mjs`
- Move: `02_MA_NGUON_WEB_DAY_DU_REACT/layout.tsx` → `02_MA_NGUON_WEB_DAY_DU_REACT/app/layout.tsx`
- Move: `02_MA_NGUON_WEB_DAY_DU_REACT/globals.css` → `02_MA_NGUON_WEB_DAY_DU_REACT/app/globals.css`
- Modify: `02_MA_NGUON_WEB_DAY_DU_REACT/app/layout.tsx`

- [ ] **Step 1: Add the smallest runnable Next configuration**

  Set scripts to `dev: next dev`, `build: next build`, `start: next start`, `lint: eslint .`, and `test: vitest run`. Add `vitest`, `jsdom`, and `@testing-library/react` as development dependencies alongside the minimal Next/React/TypeScript/ESLint dependencies. Create `vitest.config.ts` with `environment: "jsdom"` and a `tests/**/*.test.{ts,tsx}` include pattern so TypeScript test modules run directly.

- [ ] **Step 2: Add explicit TypeScript and Next settings**

  `tsconfig.json` must use strict mode, `moduleResolution: "bundler"`, include `next-env.d.ts`, and exclude `node_modules`. Start from Next's JSX-preserving configuration; accept Next 16 normalizing it to `jsx: "react-jsx"` during its generated configuration update.

- [ ] **Step 3: Make the layout a valid App Router layout**

  ```tsx
  import type { Metadata } from "next";
  import "./globals.css";

  export const metadata: Metadata = {
    title: "TAPA - LUYỆN THI EPS TOPIK",
    description: "Nền tảng luyện thi EPS TOPIK.",
  };

  export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <html lang="vi"><body>{children}</body></html>;
  }
  ```

- [ ] **Step 4: Verify the skeleton build before adding features**

  Run: `npm install && npm run build` from `02_MA_NGUON_WEB_DAY_DU_REACT/`.

  Expected: Next emits a production build without missing configuration errors.

- [ ] **Step 5: Commit when Git is available**

  ```bash
  git add 02_MA_NGUON_WEB_DAY_DU_REACT
  git commit -m "chore: bootstrap TAPA Next.js app"
  ```

### Task 2: Move editable assets and define the domain model

**Files:**
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/types/learning.ts`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/lib/content.ts`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/lib/exam.ts`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/tests/exam.test.ts`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/public/images/` (six copied files)
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/public/audio/de-007.mp3`

- [ ] **Step 1: Write failing tests for immutable exam rules**

  ```ts
  import { describe, expect, it } from "vitest";
  import { calculateScore, getExamRules, formatTime } from "../lib/exam";

  describe("exam helpers", () => {
    it("calculates five points per correct answer", () => {
      expect(calculateScore([{ id: 1, answer: 2 }, { id: 2, answer: 0 }], { 1: 2, 2: 1 })).toBe(5);
    });

    it("defines EPS thresholds and durations", () => {
      expect(getExamRules("combined")).toEqual({ questionCount: 40, durationSeconds: 3000, maximumScore: 200, threshold: 150 });
      expect(formatTime(65)).toBe("01:05");
    });
  });
  ```

- [ ] **Step 2: Confirm tests fail because modules do not exist**

  Run: `npm test`.

  Expected: FAIL with module-not-found for `lib/exam`.

- [ ] **Step 3: Define types and pure helpers**

  Add `ExamKind`, `Question`, `Lesson`, `LibraryItem`, `BestScores`, and `ExamRules` types. Implement `calculateScore`, `getExamRules`, `formatTime`, and `isPassing` without browser APIs. Rules are 20/1,500/100/75 for reading/listening and 40/3,000/200/150 for combined; unanswered answers score zero.

- [ ] **Step 4: Build original static content, not an extraction of the bundled reference**

  Add 60 neutral lesson labels, six catalog groups, and reference-derived UI labels as first-party typed data. To preserve functional exam and exercise mechanics without reusing removed Korean/Vietnamese word/exercise messages, generate 20 reading and 20 listening entries with neutral labels (`Question 01`, `Option A`–`D`), stable answer indexes, short generic explanations, and the required audio ranges. Lesson free exercises similarly use neutral prompts/options. Keep all application text in normal UTF-8 source form.

- [ ] **Step 5: Copy and describe the original editable assets without changing their source files**

  Copy `01_BAN_DE_SUA_CO_BAN/assets/images/*` to `public/images/` and `assets/audio/de-007.mp3` to `public/audio/de-007.mp3`. Add an `AssetImage` type (`src`, `alt`, `width`, `height`) and map each copied image in `content.ts` to a stable `/images/...` URL, its inspected intrinsic dimensions, and a meaningful Vietnamese alt text. Render all non-decorative question/catalog images with that metadata; mark decorative illustration elements `aria-hidden` rather than assigning empty placeholder alt text.

- [ ] **Step 6: Verify pure behavior**

  Run: `npm test`.

  Expected: PASS.

- [ ] **Step 7: Commit when Git is available**

  ```bash
  git add 02_MA_NGUON_WEB_DAY_DU_REACT
  git commit -m "feat: add TAPA content model and exam rules"
  ```

### Task 3: Add SSR-safe score persistence and the exam session state machine

**Files:**
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/hooks/use-progress.ts`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/hooks/use-exam-session.ts`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/tests/progress.test.ts`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/tests/exam-session.test.tsx`

- [ ] **Step 1: Write failing storage parsing tests**

  ```ts
  import { describe, expect, it } from "vitest";
  import { parseProgress } from "../hooks/use-progress";

  describe("parseProgress", () => {
    it("returns defaults for invalid or obsolete progress", () => {
      expect(parseProgress("not json")).toEqual({ reading: 0, listening: 0, combined: 0 });
      expect(parseProgress('{"version":0}')).toEqual({ reading: 0, listening: 0, combined: 0 });
    });
  });
  ```

- [ ] **Step 2: Confirm tests fail**

  Run: `npm test`.

  Expected: FAIL with module-not-found or missing `parseProgress`.

- [ ] **Step 3: Implement a versioned, SSR-safe progress hook**

  Export a pure `parseProgress(serialized)` helper and a `useProgress` hook. Default to zero scores during server rendering and initial hydration; read/write `tapa-progress` in an effect only. Reject malformed, incomplete, non-numeric, or wrong-version values. Update each best score with `Math.max`.

- [ ] **Step 4: Write session-hook failures with fake timers**

  With `renderHook` and `vi.useFakeTimers()`, assert: an answer is stored against its question id; reading next advances only after an answer; combined question 20 enters `transition`; `enterListening()` starts question 21; advancing elapsed time to zero submits only once; and `exit()` returns idle/discards the draft. Ensure every test calls `vi.useRealTimers()` after execution.

- [ ] **Step 5: Confirm the session tests fail**

  Run: `npm test -- tests/exam-session.test.tsx`.

  Expected: FAIL because `useExamSession` does not yet exist.

- [ ] **Step 6: Implement the explicit session reducer/hook**

  Model `idle`, `active`, `transition`, and `submitted` phases. Provide `start(kind)`, `answer(questionId, optionIndex)`, `previous()`, `next()`, `enterListening()`, `submit()`, `exit()`, and `retry()`. Use an effect-owned interval only for active/transition phases, clear it on every exit path, and submit exactly once on zero. At combined question 20, enter the static reference transition state; never auto-advance it.

- [ ] **Step 7: Verify tests**

  Run: `npm test`.

  Expected: PASS.

- [ ] **Step 8: Commit when Git is available**

  ```bash
  git add 02_MA_NGUON_WEB_DAY_DU_REACT
  git commit -m "feat: add persistent progress and exam state"
  ```

### Task 4: Implement bounded, two-pass listening audio

**Files:**
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/hooks/use-listening-audio.ts`
- Modify: `02_MA_NGUON_WEB_DAY_DU_REACT/hooks/use-exam-session.ts`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/tests/listening-audio.test.tsx`

- [ ] **Step 1: Write the failing bounded-audio hook tests**

  Mock an `HTMLAudioElement` with writable `currentTime`, `play`, and `pause` methods. Using fake timers, assert that `playCurrent` starts at the configured range start; the first end restarts at the range start for pass two; the second end pauses and calls `onFinished` after 900 ms; rejected `play()` resets `playing`; and cleanup pauses audio and cancels pending advancement.

- [ ] **Step 2: Confirm the audio tests fail**

  Run: `npm test -- tests/listening-audio.test.tsx`.

  Expected: FAIL because `useListeningAudio` does not yet exist.

- [ ] **Step 3: Define the hook API before wiring UI**

  The hook accepts an `HTMLAudioElement | null`, `{ start, end }`, and `onFinished`; it returns `{ playing, pass, playCurrent, onTimeUpdate, stop }`.

- [ ] **Step 4: Implement exact range semantics**

  `playCurrent` sets `currentTime` to `start`, sets pass one, and catches rejected `play()` promises by setting `playing` false. When `currentTime >= end`, start pass two from `start`; after pass two, pause and invoke `onFinished` after 900 ms. Clear all pending timeouts on cleanup/question change/exit. Do not expose seeking beyond the configured segment.

- [ ] **Step 5: Wire listening state to the session flow**

  Include a single preloaded `/audio/de-007.mp3` element in the active exam. Reading question changes do not start audio. Listening display has a labeled playback button; answer buttons remain enabled while playing.

- [ ] **Step 6: Run focused audio tests, lint, and build**

  Run: `npm test -- tests/listening-audio.test.tsx && npm run lint && npm run build`.

  Expected: PASS without leaked timer or browser-global errors.

- [ ] **Step 7: Commit when Git is available**

  ```bash
  git add 02_MA_NGUON_WEB_DAY_DU_REACT
  git commit -m "feat: add two-pass listening playback"
  ```

### Task 5: Build the app shell and reference-faithful catalog views

**Files:**
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/app/page.tsx`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/app/providers.tsx`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/tapa-app.tsx`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/site-header.tsx`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/dashboard.tsx`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/library-page.tsx`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/lessons.tsx`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/practice-types.tsx`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/exam-library.tsx`

- [ ] **Step 1: Create the provider and client composition boundaries**

  `app/providers.tsx` has `"use client"` and owns client-only providers/state initialization. `app/layout.tsx` wraps `{children}` in `<Providers>`. `app/page.tsx` renders `<TapaApp />`. In `tapa-app.tsx`, define a discriminated `View` union and keep only navigation, open lesson id, and paywall visibility at this level. `navigate` resets overlays and calls `window.scrollTo` only from event handling.

- [ ] **Step 2: Build navigation and dashboard from the reference as fresh React components**

  Implement the brand/header, hero, cards, daily study row, feature cards, and CTA using semantic buttons and callbacks. Do not copy the reference's bundled/minified JavaScript. Use actual headings and landmark sections.

- [ ] **Step 3: Build library, lesson list, practice, and exam-library views**

  Keep filtering state local to `LibraryPage`; calculate the visible list directly from the input (no effect-mirrored state). Use direct data imports. Lessons switch volumes and open their overlay. Exam cards show best score and 75% unlock progress; cards still permit retries.

- [ ] **Step 4: Add navigation-focused accessibility**

  Mark the selected view with `aria-current="page"`; add labels for icon-only controls; ensure all controls are native buttons; retain a strong `:focus-visible` treatment.

- [ ] **Step 5: Verify application build**

  Run: `npm run lint && npm run build`.

  Expected: PASS.

- [ ] **Step 6: Commit when Git is available**

  ```bash
  git add 02_MA_NGUON_WEB_DAY_DU_REACT
  git commit -m "feat: add TAPA catalog and dashboard views"
  ```

### Task 6: Build accessible lesson and paywall dialogs

**Files:**
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/lesson-modal.tsx`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/paywall-modal.tsx`
- Modify: `02_MA_NGUON_WEB_DAY_DU_REACT/components/tapa-app.tsx`

- [ ] **Step 1: Implement a small reusable dialog-effect helper inside each focused component**

  On mount: remember `document.activeElement`, set `document.body.style.overflow = "hidden"`, and make the app root inert. On cleanup: remove inertness, restore scroll style, and restore focus. Listen for Escape and implement Tab/Shift+Tab focus wrapping across focusable descendants.

- [ ] **Step 2: Build the lesson overlay**

  Use `role="dialog"`, `aria-modal="true"`, and an accessible title. Reproduce book/unit hero, in-page section links, general lesson structure, and three answerable free prompts without requiring the omitted word/exercise messages. The close button, Escape key, and parent close path all perform the cleanup.

- [ ] **Step 3: Build the display-only paywall**

  Reproduce the reference presentation and benefits. The purchase call-to-action closes the display-only modal; it must not claim payment or unlock functionality.

- [ ] **Step 4: Verify modal behavior manually and in build**

  Run: `npm run build`.

  Manual: open/close via mouse and keyboard, verify focus restoration and no background scroll.

- [ ] **Step 5: Commit when Git is available**

  ```bash
  git add 02_MA_NGUON_WEB_DAY_DU_REACT
  git commit -m "feat: add accessible lesson and paywall dialogs"
  ```

### Task 7: Build exam, result, and review components

**Files:**
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/exam-session.tsx`
- Create: `02_MA_NGUON_WEB_DAY_DU_REACT/components/exam-review.tsx`
- Modify: `02_MA_NGUON_WEB_DAY_DU_REACT/components/tapa-app.tsx`

- [ ] **Step 1: Render active exam state from the hook without duplicate state**

  Show exit, section chip, timer, progress bar, optional bounded-audio panel, question image, answer options, prior/next actions, and early submit. Disable Next only for unanswered reading questions. Use a conditional ternary for mutually exclusive content rather than `&&` chains where state transitions need explicit output.

- [ ] **Step 2: Reproduce submitted and transition states**

  The combined boundary displays the static reference transition card ("30 giây chuyển sang phần Nghe") with a `Chuyển ngay` button. Result calculates score/correct/wrong/time from submitted state and supports review, retry, and return-to-library.

- [ ] **Step 3: Implement the review selector**

  Render question status buttons, the selected question's answer choices, correct/incorrect state, explanation, image when present, and a compact review summary. Do not construct a vocabulary review that depends on the intentionally omitted word-level data.

- [ ] **Step 4: Run tests, lint, and build**

  Run: `npm test && npm run lint && npm run build`.

  Expected: all commands pass.

- [ ] **Step 5: Commit when Git is available**

  ```bash
  git add 02_MA_NGUON_WEB_DAY_DU_REACT
  git commit -m "feat: add TAPA exam and review experience"
  ```

### Task 8: Apply the design system and responsive fidelity pass

**Files:**
- Modify: `02_MA_NGUON_WEB_DAY_DU_REACT/app/globals.css`
- Modify: all components in `02_MA_NGUON_WEB_DAY_DU_REACT/components/` as needed for semantic styling hooks

- [ ] **Step 1: Recreate the reference token system first**

  Define the cream/paper/ink/yellow/blue/green/coral palette, shadows, borders, spacing, typography, and focus-ring variables from the reference. Keep styling in CSS classes; do not build inline style objects except dynamic progress widths.

- [ ] **Step 2: Implement desktop layout states**

  Match the reference header, hero illustration/cards, grids, dialogs, exam card, result card, and review layouts at 1440 × 900. Use `content-visibility: auto` only for long non-active lists such as lesson cards.

- [ ] **Step 3: Implement mobile reflow and reduced motion**

  At a small breakpoint, make the header navigation scrollable/collapsible, turn grids into one column, reduce heading scale, preserve touch target sizes, and add `@media (prefers-reduced-motion: reduce)` overrides for smooth scroll and waveform/transition animation.

- [ ] **Step 4: Validate required visual states**

  At 1440 × 900 and 390 × 844, inspect: home, vocabulary, lesson dialog, paywall, reading question, listening pass two, combined transition, result, and review. Compare each to the reference; correct material hierarchy, color, spacing, control, or reflow differences.

- [ ] **Step 5: Complete browser-functional acceptance checks**

  In a production build served with `npm run start`, verify all of the following at desktop and mobile widths:

  - Complete a lesson's free exercise and an exam using keyboard-only Tab/Shift+Tab/Enter/Space controls, including dialog open/close and visible focus.
  - Finish an exam, reload, and confirm the best score remains; corrupt `localStorage.tapa-progress`, reload, and confirm the app safely shows default scores.
  - Navigate to every image-backed question and confirm no image request fails; start a listening question and confirm `de-007.mp3` loads, plays each range twice, and falls back to a usable play button if playback is rejected.
  - Exit during active audio and confirm it pauses; wait out a short test timer and confirm a single result submission.

- [ ] **Step 6: Run final automated verification**

  Run: `npm test && npm run lint && npm run build`.

  Expected: PASS with a production output and no lint errors.

- [ ] **Step 7: Commit when Git is available**

  ```bash
  git add 02_MA_NGUON_WEB_DAY_DU_REACT
  git commit -m "style: match TAPA reference responsive design"
  ```

### Task 9: Document how to run and safely edit the new application

**Files:**
- Modify: `02_MA_NGUON_WEB_DAY_DU_REACT/README_REACT.md`
- Modify: `README.md`

- [ ] **Step 1: Document the runnable command sequence**

  State that users should enter `02_MA_NGUON_WEB_DAY_DU_REACT`, run `npm install`, then `npm run dev`; include build/lint/test commands.

- [ ] **Step 2: Document edit points and reference policy**

  Identify `lib/content.ts`, `public/images`, `public/audio`, and `app/globals.css` as normal customization points. State that `TAPA_LUYEN_THI_EPS_TOPIK.html` is a visual/behavior reference only, not application source.

- [ ] **Step 3: Verify documentation commands**

  Run: `npm test && npm run lint && npm run build`.

  Expected: PASS.

- [ ] **Step 4: Commit when Git is available**

  ```bash
  git add README.md 02_MA_NGUON_WEB_DAY_DU_REACT/README_REACT.md
  git commit -m "docs: explain TAPA Next.js project"
  ```
