/*
  FILE CHỨC NĂNG
  Nếu mới học code, hãy đọc từng hàm từ trên xuống dưới.
*/

const DATA = window.TAPA_DATA;
const app = document.querySelector("#app");
const paywall = document.querySelector("#paywall");
let currentBook = 2;
let examState = null;

// Chuyển trang khi bấm menu.
document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});
document.querySelector("#close-paywall").addEventListener("click", () => paywall.classList.add("hidden"));

function showPage(page) {
  document.querySelectorAll(".nav-button").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });
  if (page === "home") renderHome();
  if (page === "vocabulary") renderVocabulary();
  if (page === "grammar") renderGrammar();
  if (page === "lessons") renderLessons();
  if (page === "practice") renderExamLibrary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">NỀN TẢNG LUYỆN THI EPS TOPIK</p>
        <h1>Học vững từng bài,<br><em>đỗ chắc</em> kỳ thi EPS.</h1>
        <p>Từ giáo trình đến phòng thi trong một lộ trình rõ ràng. Học - luyện - chữa - làm lại cho đến khi thật sự đạt.</p>
        <div class="actions">
          <button class="primary" onclick="showPage('lessons')">Bắt đầu học bài →</button>
          <button class="secondary" onclick="showPage('practice')">Thi thử đề 007</button>
        </div>
      </div>
      <div class="hero-art"><div class="bubble">오늘도<br><b>힘내요!</b><span>🐣</span><small>Hôm nay cũng cố lên nhé!</small></div></div>
    </section>
    <section class="section white">
      <p class="eyebrow">HỌC ĐÚNG TRỌNG TÂM</p>
      <h2>Một nơi cho toàn bộ lộ trình EPS</h2>
      <div class="feature-grid">
        ${card("01", "Từ vựng theo chủ đề", "Học theo nhóm nghĩa, ví dụ và hình ảnh.", "vocabulary")}
        ${card("02", "Ngữ pháp theo dạng", "So sánh công thức dễ nhầm trong đề.", "grammar")}
        ${card("03", "60 bài giáo trình", "Đủ từ vựng, ngữ pháp và văn hóa.", "lessons")}
        ${card("04", "Luyện đề có khóa", "Phải đạt ngưỡng mới mở đề tiếp theo.", "practice")}
      </div>
    </section>`;
}

function card(number, title, description, page) {
  return `<button class="feature-card" onclick="showPage('${page}')"><span>${number}</span><h3>${title}</h3><p>${description}</p><b>Xem nội dung →</b></button>`;
}

function pageTitle(eyebrow, title, description) {
  return `<div class="page-title"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div>`;
}

function renderVocabulary() {
  app.innerHTML = `<section class="page">${pageTitle("TỪ VỰNG EPS", "Học theo chủ đề, nhớ theo ngữ cảnh", "Sửa hoặc thêm chủ đề trong file data.js.")}
    <div class="topic-grid">${DATA.vocabularyTopics.map(topic => `<article class="topic-card"><div class="topic-icon">${topic.icon}</div><span>${topic.count} từ</span><h2>${topic.title}</h2><b>${topic.korean}</b><p>${topic.description}</p><button class="primary">Học ngay</button></article>`).join("")}</div></section>`;
}

function renderGrammar() {
  app.innerHTML = `<section class="page">${pageTitle("NGỮ PHÁP EPS", "Gom ngữ pháp theo đúng dạng đề", "Mỗi nhóm có công thức gần nghĩa để dễ so sánh.")}
    <div class="topic-grid">${DATA.grammarGroups.map((item, index) => `<article class="topic-card"><div class="topic-icon">${index + 1}</div><h2>${item.title}</h2><b>${item.forms}</b><p>Cách chia · Ví dụ · Câu phân biệt</p><button class="primary">Xem ngữ pháp</button></article>`).join("")}</div></section>`;
}

function renderLessons() {
  const units = currentBook === 1 ? DATA.book1 : DATA.book2;
  const start = currentBook === 1 ? 1 : 31;
  app.innerHTML = `<section class="page">${pageTitle("HỌC THEO GIÁO TRÌNH", "60 bài EPS từ gốc đến đề thi", "Mỗi bài có từ vựng, ngữ pháp, dịch, văn hóa và luyện tập.")}
    <div class="book-tabs"><button class="${currentBook === 1 ? "active" : ""}" onclick="changeBook(1)"><b>Quyển 01</b><span>Bài 01-30</span></button><button class="${currentBook === 2 ? "active" : ""}" onclick="changeBook(2)"><b>Quyển 02</b><span>Bài 31-60</span></button></div>
    <div class="unit-grid">${units.map((name, index) => { const number = start + index; return `<button onclick="openLesson(${number})"><span>${String(number).padStart(2, "0")}</span><div><b>${name}</b><small>Từ vựng · Ngữ pháp · Văn hóa</small></div><strong>Mở bài →</strong></button>`; }).join("")}</div></section>`;
}

function changeBook(book) { currentBook = book; renderLessons(); }

function openLesson(number) {
  const name = number <= 30 ? DATA.book1[number - 1] : DATA.book2[number - 31];
  app.innerHTML = `<section class="page lesson">${pageTitle(`BÀI ${number}`, name, "Bản học thử hiển thị cấu trúc một bài hoàn chỉnh.")}
    <button class="back" onclick="renderLessons()">← Quay lại kho bài</button>
    <h2>01. Từ vựng</h2><div class="word-list">${DATA.lesson39.vocabulary.map((word, index) => `<p><span>${index + 1}</span><b>${word[0]}</b><em>${word[1]}</em><button>☆</button></p>`).join("")}</div>
    <h2>02. Ngữ pháp</h2>${DATA.lesson39.grammar.map(grammar => `<article class="grammar-box"><h3>${grammar.form}</h3><p>${grammar.meaning}</p><b>${grammar.example}</b></article>`).join("")}
    <h2>03. Luyện dịch và văn hóa</h2><blockquote>반장님이 파이프를 여기에서 자르라고 했어요. 먼저 파이프를 바이스로 고정하세요.</blockquote><p>Quản đốc bảo tôi cắt ống ở đây. Trước tiên hãy cố định ống bằng ê-tô.</p>
    <div class="locked"><span>🔒</span><h3>Làm thử 3/20 câu</h3><p>17 câu còn lại yêu cầu mua gói.</p><button class="primary" onclick="openPaywall()">Mở khóa bài học</button></div></section>`;
}

function openPaywall() { paywall.classList.remove("hidden"); }

function renderExamLibrary() {
  const best = Number(localStorage.getItem("tapa-best-score") || 0);
  app.innerHTML = `<section class="page">${pageTitle("PHÒNG THI THỬ", "Thi thật một lần, chữa kỹ nhiều lần", "Đề mẫu: 20 câu đọc, 25 phút, 100 điểm.")}
    <article class="exam-card"><div><span>007</span><small>EPS-TOPIK</small><b>ĐỀ ĐỌC</b><i>읽기</i></div><section><p class="eyebrow">ĐỀ MẪU</p><h2>Đề đọc số 007</h2><p>20 câu · 25 phút · 100 điểm</p><strong>Điểm cao nhất: ${best}/100</strong><button class="primary" onclick="startExam()">Bắt đầu thi →</button></section></article>
    <div class="locked-exams"><span>🔒 Đề 008</span><span>🔒 Đề 009</span><span>🔒 Đề 010</span></div></section>`;
}

function startExam() {
  examState = { index: 0, answers: {}, seconds: 25 * 60, timer: null };
  examState.timer = setInterval(() => { examState.seconds--; updateTimer(); if (examState.seconds <= 0) finishExam(); }, 1000);
  renderQuestion();
}

function renderQuestion() {
  const question = DATA.readingQuestions[examState.index];
  app.innerHTML = `<section class="exam-screen"><header><button onclick="leaveExam()">← Thoát</button><b>Đề 007 · ĐỌC</b><strong id="timer">${formatTime(examState.seconds)}</strong></header><div class="progress"><i style="width:${(examState.index + 1) / DATA.readingQuestions.length * 100}%"></i></div><article class="question"><p>Câu ${examState.index + 1}/${DATA.readingQuestions.length} · 5 điểm</p><h2>${question.question}</h2>${question.image ? `<img src="${question.image}" alt="Hình câu hỏi">` : ""}<div class="options">${question.options.map((option, index) => `<button class="${examState.answers[question.id] === index ? "selected" : ""}" onclick="chooseAnswer(${index})"><span>${String.fromCharCode(65 + index)}</span>${option}</button>`).join("")}</div><button class="primary next" onclick="nextQuestion()">${examState.index === DATA.readingQuestions.length - 1 ? "Nộp bài" : "Câu tiếp theo →"}</button></article></section>`;
}

function chooseAnswer(answer) { const question = DATA.readingQuestions[examState.index]; examState.answers[question.id] = answer; renderQuestion(); }
function nextQuestion() { if (examState.index === DATA.readingQuestions.length - 1) finishExam(); else { examState.index++; renderQuestion(); } }
function leaveExam() { clearInterval(examState.timer); examState = null; renderExamLibrary(); }
function updateTimer() { const timer = document.querySelector("#timer"); if (timer) timer.textContent = formatTime(examState.seconds); }
function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }

function finishExam() {
  clearInterval(examState.timer);
  const score = DATA.readingQuestions.reduce((total, question) => total + (examState.answers[question.id] === question.correct ? 5 : 0), 0);
  const best = Math.max(score, Number(localStorage.getItem("tapa-best-score") || 0));
  localStorage.setItem("tapa-best-score", best);
  app.innerHTML = `<section class="result"><div class="score">${score}<small>/100</small></div><p class="eyebrow">KẾT QUẢ ĐỀ 007</p><h1>${score >= 75 ? "Đã đạt ngưỡng mở khóa!" : "Chưa đạt 75 điểm"}</h1><p>${score >= 75 ? "Bạn đã đủ điều kiện chuyển sang đề tiếp theo." : "Hãy chữa đề rồi làm lại. Số lần không giới hạn."}</p><div><button class="primary" onclick="reviewExam()">Chữa đề</button><button class="secondary" onclick="startExam()">Làm lại</button></div></section>`;
}

function reviewExam() {
  app.innerHTML = `<section class="page">${pageTitle("CHỮA ĐỀ 007", "Đúng ở đâu, sai vì sao", "Đọc phần giải thích rồi làm lại đến khi đạt.")}
    <div class="review-list">${DATA.readingQuestions.map(question => { const chosen = examState.answers[question.id]; return `<article class="${chosen === question.correct ? "correct" : "wrong"}"><h3>Câu ${question.id}. ${question.question}</h3><p>Bạn chọn: <b>${chosen === undefined ? "Chưa trả lời" : question.options[chosen]}</b></p><p>Đáp án đúng: <b>${question.options[question.correct]}</b></p><div>💡 ${question.explanation}</div></article>`; }).join("")}</div><button class="primary" onclick="startExam()">Làm lại đề →</button></section>`;
}

showPage("home");

