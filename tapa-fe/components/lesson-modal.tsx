"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { Lesson } from "../types/learning";

type LessonModalProps = {
  lesson: Lesson;
  onClose: () => void;
  onOpenPaywall: () => void;
};

const exercises = [
  { prompt: "A sign says ‘Open’. What does it tell you?", options: ["Wait outside", "The place is open.", "Return tomorrow"], answerIndex: 1 },
  { prompt: "A note says ‘Bring ID’. What should you take?", options: ["Your identification.", "A chair", "A timetable"], answerIndex: 0 },
  { prompt: "A card says ‘Line 2’. Which line should you use?", options: ["Line 1.", "Line 2.", "Line 3."], answerIndex: 1 },
];

function focusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"));
}

export function LessonModal({ lesson, onClose, onOpenPaywall }: LessonModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) return;
    const elements = focusableElements(dialogRef.current);
    if (elements.length === 0) return;
    const first = elements[0];
    const last = elements[elements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="lesson-modal-backdrop">
      <div ref={dialogRef} className="lesson-dialog" data-lesson-dialog="true" role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={handleKeyDown}>
        <header className="lesson-dialog-header">
          <div><p>LESSON {String(lesson.order).padStart(2, "0")}</p><h2 id={titleId}>{lesson.label}</h2></div>
          <button type="button" onClick={onClose} aria-label="Đóng bài học">×</button>
        </header>
        <nav className="lesson-dialog-nav" aria-label="Mục lục bài học">
          <a href="#lesson-vocabulary">Từ vựng</a><a href="#lesson-grammar">Ngữ pháp</a><a href="#lesson-translation">Bản dịch</a><a href="#lesson-culture">Văn hóa</a><a href="#lesson-exercises">Luyện tập</a>
        </nav>
        <div className="lesson-dialog-content">
          <section className="lesson-introduction" aria-labelledby={`${titleId}-intro`}>
            <p>BUỔI HỌC NGẮN</p><h3 id={`${titleId}-intro`}>Thực hành từng bước, theo nhịp của bạn</h3><span>Một bài học trung tính để làm quen với từ, cấu trúc và các câu hỏi đọc hiểu đơn giản.</span>
          </section>
          <section id="lesson-vocabulary" aria-labelledby={`${titleId}-vocabulary`}>
            <h3 id={`${titleId}-vocabulary`}>Từ vựng</h3>
            <div className="lesson-vocabulary-list"><p><b>open</b><span>mở cửa, sẵn sàng sử dụng</span><em>“The library is open.”</em></p><p><b>notice</b><span>thông báo ngắn</span><em>“Read the notice.”</em></p><p><b>line</b><span>hàng hoặc tuyến được đánh số</span><em>“Use line 2.”</em></p></div>
          </section>
          <section id="lesson-grammar" aria-labelledby={`${titleId}-grammar`}>
            <h3 id={`${titleId}-grammar`}>Ngữ pháp</h3>
            <div className="lesson-grammar-note"><b>Subject + be + adjective</b><p>Dùng <em>be</em> để mô tả trạng thái: <strong>The place is open.</strong> Câu này cho biết địa điểm đang trong trạng thái mở cửa.</p></div>
          </section>
          <section id="lesson-translation" aria-labelledby={`${titleId}-translation`}>
            <h3 id={`${titleId}-translation`}>Bản dịch</h3>
            <blockquote>“Please read the notice and use line 2.”</blockquote><p className="lesson-translation-copy">“Hãy đọc thông báo và sử dụng hàng (hoặc tuyến) số 2.”</p>
          </section>
          <section id="lesson-culture" aria-labelledby={`${titleId}-culture`}>
            <h3 id={`${titleId}-culture`}>Ghi chú văn hóa</h3>
            <p className="lesson-culture-copy">Trong các không gian chung, biển báo và thông báo ngắn giúp mọi người đi đúng nơi, đúng thời điểm. Đọc kỹ số, thời gian và hướng dẫn trước khi thực hiện.</p>
          </section>
          <section id="lesson-exercises" aria-labelledby={`${titleId}-exercises`}>
            <h3 id={`${titleId}-exercises`}>Luyện tập</h3>
            <ol className="lesson-exercises">
              {exercises.map((exercise, exerciseIndex) => {
                const selectedAnswer = answers[exerciseIndex];
                const isAnswered = selectedAnswer !== undefined;
                const isCorrect = selectedAnswer === exercise.answerIndex;
                return <li key={exercise.prompt}><strong>{exerciseIndex + 1}. {exercise.prompt}</strong><div className="lesson-answer-options">{exercise.options.map((option, optionIndex) => <button key={option} type="button" className={selectedAnswer === optionIndex ? (optionIndex === exercise.answerIndex ? "correct" : "incorrect") : ""} aria-pressed={selectedAnswer === optionIndex} onClick={() => setAnswers((current) => ({ ...current, [exerciseIndex]: optionIndex }))}>{option}</button>)}</div>{isAnswered && <p className={`lesson-answer-feedback ${isCorrect ? "correct" : "incorrect"}`} role="status">{isCorrect ? "Chính xác." : `Chưa đúng. Đáp án: ${exercise.options[exercise.answerIndex]}`}</p>}</li>;
              })}
            </ol>
          </section>
          <section className="lesson-upgrade" aria-label="Nội dung nâng cao">
            <p>Nội dung nâng cao</p>
            <h3>Thêm bài luyện theo lộ trình</h3>
            <span>Gói học chỉ được giới thiệu trong giao diện này; chưa có thanh toán hoặc mở khóa.</span>
          </section>
          <button className="lesson-upgrade-action" type="button" onClick={onOpenPaywall}>Mở gói học</button>
        </div>
      </div>
    </div>
  );
}
