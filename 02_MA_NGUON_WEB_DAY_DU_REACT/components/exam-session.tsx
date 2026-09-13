"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { useExamSession } from "../hooks/use-exam-session";
import { useListeningAudio } from "../hooks/use-listening-audio";
import { formatTime, getExamRules, isPassing } from "../lib/exam";
import { ExamReview } from "./exam-review";

const optionLabels = ["A", "B", "C", "D"];
type Session = ReturnType<typeof useExamSession>;

export function ExamSession({ session, onReturnToLibrary }: { session: Session; onReturnToLibrary: () => void }) {
  const { answers, next, phase } = session;
  const [isReviewing, setIsReviewing] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [audioMessage, setAudioMessage] = useState<{ questionId: string; text: string } | null>(null);
  const autoPlayNextRef = useRef(false);
  const advanceAfterAudioRef = useRef<string | null>(null);
  const question = session.currentQuestion;
  const audioRange = question?.audioRange;
  const { playing, pass, playCurrent, onTimeUpdate } = useListeningAudio({ audio: audioElement, startSeconds: audioRange?.startSeconds ?? 0, endSeconds: audioRange?.endSeconds ?? 0, onFinished: () => { if (!question) return; setAudioMessage({ questionId: question.id, text: "Đã phát xong hai lượt." }); if (answers[question.id] !== undefined) { autoPlayNextRef.current = true; next(); return; } advanceAfterAudioRef.current = question.id; } });

  useEffect(() => {
    if (phase !== "active" || question?.kind !== "listening") {
      advanceAfterAudioRef.current = null;
      return;
    }
    if (advanceAfterAudioRef.current !== question.id || answers[question.id] === undefined) return;
    advanceAfterAudioRef.current = null;
    autoPlayNextRef.current = true;
    next();
  }, [answers, next, phase, question?.id, question?.kind]);

  useEffect(() => {
    if (!autoPlayNextRef.current || !audioElement || !audioRange) return;
    autoPlayNextRef.current = false;
    void playCurrent();
  }, [audioElement, audioRange, playCurrent, question?.id]);

  const playListeningQuestion = () => {
    setAudioMessage(null);
    advanceAfterAudioRef.current = null;
    void playCurrent();
  };

  if (session.phase === "submitted" && session.result) {
    if (isReviewing) return <ExamReview questions={session.questions} answers={session.answers} onReturn={() => setIsReviewing(false)} />;
    const rules = getExamRules(session.result.kind);
    const correct = session.result.score / 5;
    const elapsed = rules.durationSeconds - session.remainingSeconds;
    const passed = isPassing(session.result.score, session.result.kind);
    return <section className="result-shell" aria-labelledby="result-heading"><article className="result-card"><p className="eyebrow">{passed ? "ĐÃ ĐẠT MỤC TIÊU" : "TIẾP TỤC LUYỆN TẬP"}</p><div className={`score-orb${passed ? " pass" : ""}`}><b>{session.result.score}</b><span>/{rules.maximumScore}</span></div><h1 id="result-heading">Kết quả bài thi</h1><p>{passed ? "Bạn đã đạt mốc điểm của đề này." : "Bạn có thể xem lại đáp án rồi làm lại khi sẵn sàng."}</p><div className="result-stats"><span><b>{correct}</b><small>Đúng</small></span><span><b>{session.questions.length - correct}</b><small>Chưa đúng</small></span><span><b>{formatTime(elapsed)}</b><small>Thời gian</small></span></div><div className="result-actions"><button type="button" onClick={() => setIsReviewing(true)}>Xem lại đáp án</button><button type="button" onClick={session.retry}>Làm lại</button><button type="button" className="ghost" onClick={() => { session.exit(); onReturnToLibrary(); }}>Quay về danh sách đề</button></div></article></section>;
  }
  if (session.phase === "transition") return <section className="exam-shell" aria-labelledby="transition-heading"><article className="transition-card"><p className="mini-logo">TAPA</p><h1 aria-hidden="true">30</h1><h2 id="transition-heading">30 giây chuyển sang phần Nghe</h2><p>Hãy chuẩn bị tai nghe trước khi tiếp tục.</p><button type="button" onClick={session.enterListening}>Chuyển ngay</button></article></section>;
  if (session.phase !== "active" || !session.kind || !question) return null;

  const sectionLabel = question.kind === "listening" ? "NGHE HIỂU" : "ĐỌC HIỂU";
  const answered = session.answers[question.id] !== undefined;
  const progress = ((session.currentIndex + 1) / session.questions.length) * 100;
  const isFinalQuestion = session.currentIndex === session.questions.length - 1;
  const visibleAudioMessage = audioMessage?.questionId === question.id ? audioMessage.text : "";
  return <section className="exam-shell" aria-labelledby="question-heading"><header className="exam-top"><button type="button" className="exit" onClick={() => { session.exit(); onReturnToLibrary(); }}>Thoát bài thi</button><div><b>TAPA</b><span>{sectionLabel}</span></div><strong aria-label={`Còn lại ${formatTime(session.remainingSeconds)}`}>{formatTime(session.remainingSeconds)}</strong></header><div className="exam-progress" role="progressbar" aria-label={`Tiến độ câu ${session.currentIndex + 1} trên ${session.questions.length}`} aria-valuemin={1} aria-valuemax={session.questions.length} aria-valuenow={session.currentIndex + 1}><i style={{ width: `${progress}%` }} /></div><article className="question-card"><div className="question-meta"><span>Câu {session.currentIndex + 1}/{session.questions.length}</span><span>{sectionLabel}</span></div><h1 id="question-heading">{question.label}</h1>{question.image && <Image className="question-image" src={question.image.src} alt={question.image.alt} width={question.image.width} height={question.image.height} />}{audioRange && <><audio ref={setAudioElement} preload="metadata" src={audioRange.src} onTimeUpdate={() => void onTimeUpdate()} /><div className="audio-box"><button type="button" onClick={playListeningQuestion} disabled={playing}>{playing ? `Đang phát lượt ${pass}/2` : "Phát câu nghe"}</button><span aria-live="polite">{visibleAudioMessage || (playing ? `Lượt ${pass}/2` : "Mỗi câu phát tối đa hai lượt")}</span></div></>}<div className="options" role="group" aria-label="Các phương án trả lời">{question.options.map((option, index) => <button type="button" key={option} className={session.answers[question.id] === index ? "selected" : ""} aria-pressed={session.answers[question.id] === index} onClick={() => session.answer(question.id, index)}><b>{optionLabels[index]}</b>{option}</button>)}</div><div className="question-actions"><button type="button" onClick={session.previous} disabled={session.currentIndex === 0}>Câu trước</button>{question.kind !== "listening" && <button type="button" onClick={session.next} disabled={!answered}>{isFinalQuestion ? "Nộp bài" : "Câu tiếp"}</button>}</div><button type="button" className="submit-float" onClick={session.submit}>Nộp bài sớm</button></article></section>;
}
