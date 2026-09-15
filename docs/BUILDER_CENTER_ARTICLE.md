# Weekend Deployment Challenge: TAPA – EPS-TOPIK Exam Prep

**Tag:** #deployment

> _Replace the two placeholders before publishing:_
> - `LIVE_URL` → your Amplify URL (e.g. `https://main.xxxx.amplifyapp.com`)
> - `REPO_URL` → your GitHub repo URL
> _Add 2–3 screenshots where marked (dashboard, an exam in progress, the results/review screen)._

---

## What My App Does

**TAPA** is a study platform for the **EPS-TOPIK** exam — the Korean-language test that workers must pass to qualify for jobs in South Korea under the Employment Permit System. For many test-takers the official prep material is scattered across PDFs and paper booklets, with no easy way to simulate the real exam or track whether they're actually improving. TAPA solves that: it puts structured lessons, vocabulary, and timed mock exams in one place that runs in any browser.

From a user's perspective, you land on a **dashboard** showing your progress and best scores. You can open **lessons** to study vocabulary (real EPS-TOPIK items like appliances, tools, and workplace objects, each with an image and audio), then head to the **exam library** to take a timed mock test. There are three exam modes that mirror the real thing:

- **Reading** — 20 questions, 25 minutes, pass at 75/100
- **Listening** — 20 questions, 25 minutes, with playable audio clips, pass at 75/100
- **Combined** — 40 questions, 50 minutes, pass at 150/200

When time runs out or you submit, the app scores you instantly and opens a **review screen** so you can see every question, your answer, and the correct one. Your best scores and progress are saved in the browser, so you can come back and pick up where you left off. There's also a paywall component that gates advanced content — the scaffolding for turning this into a real product later.

[SCREENSHOT: dashboard]

## How I Built It

I built TAPA with **Next.js 16 (App Router)**, **React 19**, and **TypeScript**. The whole app is component-driven — a `TapaApp` shell composes focused components like `dashboard`, `exam-library`, `exam-session`, `exam-review`, and `lesson-modal`. I kept the interesting logic out of the components and in small, testable modules: `lib/exam.ts` holds the scoring rules and grading, `lib/content.ts` holds the lessons and question bank, and custom hooks (`use-exam-session`, `use-listening-audio`, `use-progress`) manage the timer, audio playback, and persisted progress.

A key early decision was to keep the app **fully client-side and static** — no backend, no database. The content is bundled and progress lives in the browser, which means every route prerenders to static HTML. That made the app dramatically cheaper and simpler to deploy, and it removed a whole class of server bugs.

Two challenges stood out. First, **project structure**: the Next.js app lives in a subfolder (`02_MA_NGUON_WEB_DAY_DU_REACT`), not the repo root, and having a lockfile in a parent directory made Next.js infer the wrong workspace root during the build. I fixed this by pinning `turbopack.root` in `next.config.ts` and writing an Amplify build spec that declares the correct `appRoot`, so CI always builds from the right directory.

Second — and this is the one I learned the most from — my **first deploy returned a 404 on every page**. The site was clearly built and served (I could see `server: AmazonS3` in the response headers), but nothing loaded. Digging in, I realized Amplify was hosting my app as static files but I had pointed the build artifacts at Next's `.next/` folder, which has no servable `index.html` at its root. The fix was to make the app a true static export: I set `output: "export"` in `next.config.ts` (safe, because the app has no server code), added `images: { unoptimized: true }` since static export has no image server, and repointed the Amplify artifact `baseDirectory` to the generated `out/` folder. One push later, the same URL went from 404 to a fully working app.

Throughout, I kept a **Vitest** suite (`exam.test.ts`, `exam-session.test.tsx`, `progress.test.ts`, and more) so I could refactor with confidence before shipping.

## AWS Services Used / Architecture Overview

- **AWS Amplify Hosting** — connected directly to my GitHub repo. On every push to `main`, Amplify runs `npm ci` and `npm run build` (which produces a static `out/` folder), then publishes those files.
- **Amazon S3 + Amazon CloudFront** — Amplify stores the built static assets in **S3** and serves them globally through a **CloudFront** CDN with automatic HTTPS/TLS. (I confirmed this from the response headers: `server: AmazonS3` behind a CloudFront edge.)

**Architecture (text diagram):**

```
Developer  --git push-->  GitHub (main)
                              |
                              v  (webhook)
                    AWS Amplify Hosting
             (npm ci -> next build -> export to out/)
                              |
                              v
                      Amazon S3 (static files)
                              |
                              v
              Amazon CloudFront (CDN + managed HTTPS)
                              |
                              v
                     User's web browser
              (static HTML/JS, progress in localStorage)
```

Because the app is static, there are no servers, containers, or databases to manage — CloudFront serves prebuilt assets from S3 globally, and the git-based pipeline gives me continuous deployment for free.

[SCREENSHOT: exam in progress + results/review screen]

## What I Learned

This was my first AWS deployment, and the biggest lesson was how far a **static-first architecture** gets you: by keeping state in the browser, I turned "deploy a web app" into "deploy files to a CDN," which is fast, cheap, and hard to break. I learned how **Amplify's git-based CI/CD** works end to end — connecting a repo, reading an `amplify.yml` build spec, and getting a live HTTPS URL without touching a server — and I got a concrete look at what sits underneath Amplify: **S3 for storage and CloudFront for global delivery**. The 404 taught me the most: I learned to **read response headers to understand where a request is actually being served from**, and that a successful build doesn't mean a servable one — the artifact folder has to contain a real `index.html`. I also learned to control a **monorepo/subfolder build** with an explicit `appRoot` and workspace root instead of trusting auto-detection. Most importantly, I lived the challenge's own advice: get something small actually live first, then fix it in the open.

## Link to App / Repo

- **Live app:** https://main.d3lz6ead3g8gpe.amplifyapp.com/
- **Source code:** https://github.com/ttuet/tapa-eps-tokpik
