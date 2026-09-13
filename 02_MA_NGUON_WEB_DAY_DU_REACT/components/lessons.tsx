import { catalogGroups, lessons } from "../lib/content";

export function Lessons({ onOpenLesson, selectedLessonId }: { onOpenLesson: (lessonId: string) => void; selectedLessonId: string | null }) {
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId);

  return <section className="page-wrap"><header className="page-title"><p className="eyebrow">LỘ TRÌNH TAPA</p><h1>Lộ trình bài học</h1><p>60 bài học ngắn được sắp xếp từ nền tảng đến luyện tập tổng hợp.</p></header>{selectedLesson && <p role="status">Đã chọn {selectedLesson.label}. Nội dung bài học sẽ được mở trong phiên tiếp theo.</p>}<section className="book-tabs" aria-label="Nhóm bài học">{catalogGroups.map((group) => <article key={group.id}><b>{group.label}</b><span>{group.description}</span></article>)}</section><section className="unit-list">{lessons.map((lesson) => <button key={lesson.id} type="button" aria-pressed={lesson.id === selectedLessonId} onClick={() => onOpenLesson(lesson.id)}><span className="unit-no">{lesson.order}</span><div><h3>{lesson.label}</h3><p>{lesson.description}</p></div><strong>→</strong></button>)}</section></section>;
}
