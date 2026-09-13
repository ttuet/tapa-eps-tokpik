export type View = "home" | "vocab" | "grammar" | "lessons" | "reading" | "listening" | "exams";

const navigation: Array<{ view: View; label: string }> = [
  { view: "home", label: "Trang chủ" },
  { view: "vocab", label: "Từ vựng" },
  { view: "grammar", label: "Ngữ pháp" },
  { view: "lessons", label: "Bài học" },
  { view: "reading", label: "Đọc hiểu" },
  { view: "listening", label: "Nghe hiểu" },
  { view: "exams", label: "Thi thử" },
];

export function SiteHeader({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => onNavigate("home")} aria-label="Về trang chủ TAPA">
        <span>T</span><div><b>TAPA</b><small>EPS TOPIK PRACTICE</small></div>
      </button>
      <nav aria-label="Điều hướng chính">
        {navigation.map((item) => (
          <button key={item.view} className={view === item.view ? "active" : ""} aria-current={view === item.view ? "page" : undefined} onClick={() => onNavigate(item.view)}>
            {item.label}
          </button>
        ))}
      </nav>
      <button className="profile" type="button" disabled aria-label="Hồ sơ (sắp có)">Hồ sơ · sắp có</button>
    </header>
  );
}
