# TAPA EPS-TOPIK Next.js migration design

## Goal

Turn the editable TAPA source into a runnable, production-ready Next.js application. The application must faithfully reproduce the layout, Vietnamese content, interactions, and visual language in `TAPA_LUYEN_THI_EPS_TOPIK.html` while making the implementation understandable and maintainable.

## Reference material

- `TAPA_LUYEN_THI_EPS_TOPIK.html` is the source of truth for visual design and behavior.
- `01_BAN_DE_SUA_CO_BAN/` supplies editable lesson/exam data and the image/audio assets.
- `02_MA_NGUON_WEB_DAY_DU_REACT/` supplies the existing React/TypeScript implementation and global styling to be decomposed.

When sources differ, preserve the reference HTML's rendered text, visual states, timings, and interaction behavior. Use the existing React source for the canonical structured content because it contains the complete 60-lesson/40-question experience; use the editable source only for its assets unless it provides a missing equivalent asset. Before implementation, create an inventory mapping every lesson title, vocabulary/grammar preview, reading question, listening prompt, explanation, audio range, and each of the six images to its `lib/content.ts` entry or `public/` path. Text is copied as Unicode source text, never from mojibake console output.

## Scope

The initial migration includes:

- The homepage dashboard, navigation, vocabulary and grammar libraries, lesson list, lesson overlay, reading and listening practice views, exam library, reading/listening/combined exams, countdown transition, result/review views, and Premium paywall.
- Existing images and the `de-007.mp3` listening asset.
- Browser-local best scores only, using a versioned LocalStorage record. Lesson completion, saved vocabulary, free-exercise answers, and a persistent wrong-answer history are explicitly out of scope for this migration; lesson exercise answers exist only while its overlay is open.
- Responsive styling that follows the supplied reference page on desktop and mobile.

The migration does not include authentication, payments, a backend, content management, analytics, or real premium entitlement enforcement.

## Architecture

Use Next.js App Router and TypeScript. The interactive learning experience is a client-side feature boundary; static data and shared presentation remain separate from the application state.

```text
app/
  layout.tsx                 Metadata and global styles
  page.tsx                   Page composition / application entry
  globals.css                Tokens, layout, responsive styles
  providers.tsx              Client-only state boundary
components/
  site-header.tsx
  dashboard.tsx
  library-page.tsx
  lessons.tsx
  lesson-modal.tsx
  practice-types.tsx
  exam-library.tsx
  exam-session.tsx
  exam-review.tsx
  paywall-modal.tsx
hooks/
  use-progress.ts            Versioned local progress persistence
  use-exam-session.ts        Timer, answers, scoring and flow
  use-listening-audio.ts     Controlled two-pass audio playback
lib/
  content.ts                 Lessons, library groups, questions, metadata
  exam.ts                    Pure scoring and formatting helpers
types/
  learning.ts                Shared content and state types
public/
  images/                    Copied editable image assets
  audio/de-007.mp3           Listening audio asset
```

`page.tsx` owns only high-level navigation and modal selection. `useExamSession` owns the exam lifecycle. The remaining components receive explicit props and do not alter shared state directly.

The repository includes standard Next.js configuration (`package.json`, `tsconfig.json`, `next.config.ts`, ESLint configuration, and test configuration). `providers.tsx` is a `use client` boundary. It reads LocalStorage only after mount, renders the same default state on server and first client render, then applies persisted best scores to avoid hydration mismatches.

## User flow and state

1. The user moves between dashboard, libraries, lessons, practice, and exams through the header or calls to action.
2. Selecting a lesson opens the full-screen lesson overlay. The learner can answer the three free exercises, or open the display-only Premium paywall.
3. Starting an exam creates a fresh session: question index, answer map, remaining time, listening-pass state, and submission state.
4. Reading exams advance with learner actions. Listening exams play each configured audio range twice and advance only after the second pass. The combined exam shows the reference transition screen after question 20.
5. Submission calculates score with pure helpers, persists the best score, and shows the result. The learner may inspect the detailed review, retry, or return to the exam library.

The persisted record is `{ version: 1, best: { reading, listening, combined } }`. Invalid, incomplete, or older records fall back safely to default zero scores.

### Exact exam rules

- Reading: 20 questions, 25 minutes (1,500 seconds), 5 points per correct answer, 100 points maximum, passing threshold 75.
- Listening: 20 questions, 25 minutes (1,500 seconds), 5 points per correct answer, 100 points maximum, passing threshold 75.
- Combined: reading questions 1–20 followed by a 30-second transition and listening questions 21–40; 50 minutes (3,000 seconds) total, 200 points maximum, passing threshold 150.
- Unanswered questions score zero. Early submission and timeout both submit the current answer map. Retrying creates a fully fresh session. Exit pauses audio, clears timer state, and discards the unfinished attempt without altering best scores.
- The result reports correct and wrong counts from submitted answers. A best score changes only when the newly submitted score is higher.

### Listening and transition behavior

- Playback begins only from the learner's explicit “play” action or a subsequent question change caused by that same exam interaction. If the browser rejects playback, show the available play control again; do not silently advance.
- Each listening question uses its configured inclusive start/end audio range. `timeupdate` detects the end, seeks to the range start, and plays exactly one second pass; after pass two it pauses and advances after the reference's 900 ms delay. The answer controls remain available while audio plays. The learner can replay only by starting the current segment again; seeking outside its range is not exposed.
- At the combined reading/listening boundary, show the reference transition card with its static “30 giây chuyển sang phần Nghe” message and “Chuyển ngay” action. It does not decrement or advance automatically; the learner explicitly enters the listening section. The exam's main timer continues during this transition, matching the reference flow.

## Performance and resilience

- All current learning content ships as static typed data; there are no request waterfalls.
- Assets use stable paths under `public/`; image dimensions/alternate text are declared where known.
- Heavy exam/review UI can be dynamically loaded only after an exam is selected, if that improves the measured initial bundle without delaying normal navigation.
- Timer callbacks are cleaned up on submission, exit, and component unmount.
- Audio playback failures leave the learner in a recoverable, visible non-playing state.
- State updates use functional setters where an update depends on prior state. Derived values, including score and threshold, are calculated during render rather than mirrored in effects.
- Search filtering is deferred only if it becomes expensive; the small initial catalog does not need premature memoization.

## Accessibility and responsive behavior

- Use semantic buttons, headings, lists, and landmarks.
- Provide meaningful image alternative text; decorative visual elements are hidden from assistive technology.
- The lesson overlay and paywall use `role="dialog"` and `aria-modal="true"`, trap focus while open, close with Escape, restore focus to their invoker on every close path, mark background content inert, and lock document scrolling.
- Keyboard users can complete exercises and exams without pointer-only interaction.
- Preserve visible focus styles and honor `prefers-reduced-motion` for animated transitions/waveforms.
- Collapse header navigation and multi-column grids at mobile widths while preserving all navigation and exam controls.

## Verification

- Type checking and linting pass.
- A production build succeeds.
- Component tests cover scoring, persisted progress parsing, timer completion, answer selection, and the listening two-pass flow.
- Browser checks cover mobile/desktop layout, keyboard navigation, local score persistence, and asset/audio availability.
- Visual comparison uses 1440 × 900 and 390 × 844 viewports. Capture and compare the reference and Next.js pages for: homepage, vocabulary library, lesson overlay, paywall, reading question, listening question on pass two, combined-exam countdown, result, and review. Layout, content, colors, hierarchy, controls, and responsive reflow must match without material regressions; deliberate accessibility-only changes may differ only where they are not visually perceptible.

## Migration constraints

- Feel free to remove the korean, vietnam message data  at word or exercies
- You can you the original HTML as a reference. Create a new project just like it. don't use it as a source code

