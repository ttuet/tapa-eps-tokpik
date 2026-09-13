"use client";

import { useEffect, useRef, useState } from "react";

import { useLearningProgress } from "../app/providers";
import { useExamSession } from "../hooks/use-exam-session";
import { Dashboard } from "./dashboard";
import { ExamLibrary } from "./exam-library";
import { ExamSession } from "./exam-session";
import { Lessons } from "./lessons";
import { LibraryPage } from "./library-page";
import { PracticeTypes } from "./practice-types";
import { SiteHeader, type View } from "./site-header";
import { LessonModal } from "./lesson-modal";
import { PaywallModal } from "./paywall-modal";
import { lessons } from "../lib/content";

export function TapaApp() {
  const [view, setView] = useState<View>("home");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const { best, recordScore } = useLearningProgress();
  const examSession = useExamSession({ onSubmit: ({ kind, score }) => recordScore(kind, score) });
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? null;

  useEffect(() => {
    if (!selectedLesson && !isPaywallOpen) return;
    const page = pageRef.current;
    const hadInert = page?.hasAttribute("inert");
    page?.setAttribute("inert", "");
    return () => {
      if (page && !hadInert) page.removeAttribute("inert");
    };
  }, [selectedLesson, isPaywallOpen]);

  const content = examSession.phase !== "idle" ? <ExamSession session={examSession} onReturnToLibrary={() => setView("exams")} /> : (() => {
    switch (view) {
      case "vocab":
        return <LibraryPage title="Thư viện từ vựng" description="Tìm tài liệu gợi nhớ từ vựng theo các tình huống thường gặp." />;
      case "grammar":
        return <LibraryPage title="Góc ngữ pháp" description="Gom các tài liệu tham khảo để bạn ôn lại cấu trúc quan trọng." />;
      case "lessons":
        return <Lessons selectedLessonId={selectedLessonId} onOpenLesson={setSelectedLessonId} />;
      case "reading":
      case "listening":
        return <PracticeTypes currentView={view} onNavigate={setView} />;
      case "exams":
        return <ExamLibrary best={best} onStart={examSession.start} />;
      case "home":
      default:
        return <Dashboard onNavigate={setView} />;
    }
  })();

  return <><div ref={pageRef}><SiteHeader view={view} onNavigate={setView} /><main id="main-content" tabIndex={-1}>{content}</main><footer><b>TAPA</b><p>Học đều đặn, tiến gần mục tiêu EPS TOPIK.</p><small>Nội dung luyện tập dành cho quá trình tự học.</small></footer></div>{selectedLesson && <LessonModal lesson={selectedLesson} onClose={() => setSelectedLessonId(null)} onOpenPaywall={() => setIsPaywallOpen(true)} />}{isPaywallOpen && <PaywallModal onClose={() => setIsPaywallOpen(false)} />}</>;
}
