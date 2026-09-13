"use client";

import { useState } from "react";
import Image from "next/image";
import type { Answers } from "../lib/exam";
import type { Question } from "../types/learning";

const optionLabels = ["A", "B", "C", "D"];

export function ExamReview({ questions, answers, onReturn }: { questions: Question[]; answers: Answers; onReturn: () => void }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const question = questions[selectedIndex];
  const selectedAnswer = answers[question.id];
  const isCorrect = selectedAnswer === question.answerIndex;
  const correctCount = questions.filter((item) => answers[item.id] === item.answerIndex).length;

  return <section className="exam-shell" aria-labelledby="review-heading"><div className="review-wrap"><header className="review-title"><p className="eyebrow">PHÂN TÍCH KẾT QUẢ</p><h1 id="review-heading">Xem lại bài thi</h1><p>{correctCount}/{questions.length} câu trả lời chính xác.</p></header><div className="review-layout"><nav aria-label="Chọn câu để xem lại">{questions.map((item, index) => { const answer = answers[item.id]; const status = answer === item.answerIndex ? "ok" : "bad"; return <button type="button" key={item.id} className={`${status}${index === selectedIndex ? " active" : ""}`} onClick={() => setSelectedIndex(index)} aria-current={index === selectedIndex ? "true" : undefined} aria-label={`Câu ${index + 1}: ${status === "ok" ? "đúng" : "chưa đúng"}`}>{index + 1}</button>; })}</nav><article className="review-card"><span className={isCorrect ? "ok-badge" : "bad-badge"}>{isCorrect ? "Trả lời đúng" : "Cần xem lại"}</span><h2>Câu {selectedIndex + 1}</h2><h3>{question.label}</h3>{question.image && <Image src={question.image.src} alt={question.image.alt} width={question.image.width} height={question.image.height} />}<div className="review-options">{question.options.map((option, index) => { const isAnswer = index === question.answerIndex; const isWrongChoice = index === selectedAnswer && !isAnswer; return <p key={option} className={isAnswer ? "right" : isWrongChoice ? "chosen-wrong" : ""}><b>{optionLabels[index]}</b>{option}{isAnswer && <span>Đáp án đúng</span>}{isWrongChoice && <span>Đã chọn</span>}</p>; })}</div><div className="explanation"><b>Giải thích</b><p>{question.explanation}</p></div></article></div><p className="result-actions"><button type="button" className="ghost" onClick={onReturn}>Quay lại kết quả</button></p></div></section>;
}
