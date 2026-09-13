import type { View } from "./site-header";

const types = [
  { view: "reading" as const, marker: "가", title: "Đọc hiểu", copy: "Nhận diện biển báo, thông báo và câu hỏi thường gặp.", chips: ["Biển báo", "Đoạn văn", "Từ vựng"] },
  { view: "listening" as const, marker: "♪", title: "Nghe hiểu", copy: "Rèn phản xạ với hội thoại và thông báo ngắn.", chips: ["Hội thoại", "Thông báo", "Phát âm"] },
];

export function PracticeTypes({ currentView, onNavigate }: { currentView: Extract<View, "reading" | "listening">; onNavigate: (view: View) => void }) {
  const selected = types.find((item) => item.view === currentView) ?? types[0];
  return <section className="page-wrap"><header className="page-title"><p className="eyebrow">LUYỆN THEO DẠNG BÀI</p><h1>{selected.title}</h1><p>{selected.copy}</p></header><section className="type-list">{types.map((item) => <article key={item.view}><span>{item.marker}</span><div><h2>{item.title}</h2><p>{item.copy}</p><div className="chips">{item.chips.map((chip) => <i key={chip}>{chip}</i>)}</div></div><button type="button" onClick={() => onNavigate(item.view)}>{item.view === currentView ? "Đang xem" : "Chuyển đến"}</button></article>)}</section><section className="practice-banner"><div><b>Chưa có phiên luyện tập trong giao diện này</b><span>Bạn có thể mở đề thi thử khi sẵn sàng kiểm tra tiến độ.</span></div><button type="button" onClick={() => onNavigate("exams")}>Đi đến thi thử</button></section></section>;
}
