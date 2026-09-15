import type { View } from "./site-header";

export function Dashboard({ onNavigate }: { onNavigate: (view: View) => void }) {
  const quickLinks: Array<{ icon: string; title: string; copy: string; view: View; color: string }> = [
    { icon: "가", title: "Từ mới hôm nay", copy: "10 từ vựng thiết thực", view: "vocab", color: "yellow" },
    { icon: "문", title: "Đọc biển báo", copy: "Luyện phản xạ nhanh", view: "reading", color: "blue" },
    { icon: "♪", title: "Nghe ngắn", copy: "5 câu hội thoại", view: "listening", color: "coral" },
  ];
  const features: Array<{ marker: string; title: string; copy: string; view: View }> = [
    { marker: "01", title: "Từ vựng theo chủ đề", copy: "Ghi nhớ bằng tranh ảnh và các tình huống gần gũi.", view: "vocab" },
    { marker: "02", title: "Bài học có lộ trình", copy: "Chia nhỏ nội dung để bạn luôn biết bước tiếp theo.", view: "lessons" },
    { marker: "03", title: "Luyện theo dạng đề", copy: "Tập trung vào đọc hiểu và nghe hiểu EPS TOPIK.", view: "reading" },
    { marker: "04", title: "Thi thử có mục tiêu", copy: "Theo dõi điểm cao nhất trước khi bước vào kỳ thi.", view: "exams" },
  ];

  return <>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">EPS TOPIK · MỖI NGÀY MỘT BƯỚC</p><h1>Học tiếng Hàn<br />để <em>tự tin hơn</em>.</h1><p>TAPA giúp bạn luyện từ vựng, dạng bài và đề thi thử trong một nhịp học nhẹ nhàng, rõ ràng.</p><div className="hero-actions"><button onClick={() => onNavigate("lessons")}>Bắt đầu học</button><button className="secondary" onClick={() => onNavigate("exams")}>Xem đề thi thử</button></div><div className="trust-row"><span>• Nội dung theo lộ trình</span><span>• Học ngắn, dễ duy trì</span><span>• Theo dõi tiến độ</span></div></div>
      <div className="hero-visual" aria-hidden="true"><div className="sun" /><div className="study-card"><div className="korean"><b>안녕하세요</b><br />Xin chào!</div><div className="mascot">📚</div><small>Mỗi ngày một bài học nhỏ</small></div><div className="float-card vocab"><span>12</span><div><b>Từ mới</b><small>đang chờ bạn</small></div></div><div className="float-card streak"><span>✦</span><div><b>Chuỗi 3 ngày</b><small>Giữ nhịp nhé!</small></div></div></div>
    </section>
    <section className="today"><div><div><p className="eyebrow">GỢI Ý HÔM NAY</p><h2>Chọn một việc nhỏ để bắt đầu</h2></div><button className="profile" onClick={() => onNavigate("lessons")}>Xem lộ trình</button></div><div className="today-grid">{quickLinks.map((link, index) => <button key={link.title} onClick={() => onNavigate(link.view)}><span className={`icon ${link.color}`}>{link.icon}</span><div><small>10–15 PHÚT</small><b>{link.title}</b><em>{link.copy}</em><i><u style={{ width: `${[45, 20, 60][index]}%` }} /></i></div><strong>→</strong></button>)}</div></section>
    <section className="feature-section"><div className="section-heading"><div><p className="eyebrow">HỌC CÓ CHỦ ĐÍCH</p><h2>Một nơi cho cả hành trình</h2></div><p>Chuyển linh hoạt giữa tài liệu, bài học, luyện tập và thi thử mà vẫn giữ được nhịp học của riêng bạn.</p></div><div className="feature-grid">{features.map((feature) => <button key={feature.marker} onClick={() => onNavigate(feature.view)}><span>{feature.marker}</span><h3>{feature.title}</h3><p>{feature.copy}</p><b>Khám phá →</b></button>)}</div></section>
    <section className="cta-band"><div><span>SẴN SÀNG LUYỆN TẬP?</span><h2>Đi từng bước, đến đúng mục tiêu.</h2><p>Chọn một bài học hoặc làm một đề thi thử để bắt nhịp ngay hôm nay.</p></div><button onClick={() => onNavigate("exams")}>Làm đề thi thử</button></section>
  </>;
}
