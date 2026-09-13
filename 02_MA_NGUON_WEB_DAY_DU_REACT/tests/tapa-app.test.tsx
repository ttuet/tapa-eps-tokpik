import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TapaApp } from "../components/tapa-app";
import { Providers } from "../app/providers";
import { ExamLibrary } from "../components/exam-library";
import { LibraryPage } from "../components/library-page";

function renderApp() {
  return render(<Providers><TapaApp /></Providers>);
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function mockAudioPlayback() {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  return play;
}

async function completeListeningAudio() {
  vi.useFakeTimers();
  const audio = document.querySelector("audio") as HTMLAudioElement;
  fireEvent.click(screen.getByRole("button", { name: "Phát câu nghe" }));
  await act(async () => undefined);
  Object.defineProperty(audio, "currentTime", { configurable: true, writable: true, value: 3 });
  fireEvent.timeUpdate(audio);
  await act(async () => undefined);
  Object.defineProperty(audio, "currentTime", { configurable: true, writable: true, value: 3 });
  fireEvent.timeUpdate(audio);
  await act(async () => undefined);
  act(() => vi.advanceTimersByTime(900));
}

describe("TapaApp", () => {
  it("changes the visible view from the semantic primary navigation", () => {
    renderApp();

    const lessons = screen.getByRole("button", { name: "Bài học" });
    fireEvent.click(lessons);

    expect(lessons.getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("heading", { name: "Lộ trình bài học" })).toBeTruthy();
  });

  it("marks the unavailable profile control as disabled", () => {
    renderApp();

    const profile = screen.getByRole("button", { name: /hồ sơ.*sắp có/i });
    expect(profile.hasAttribute("disabled")).toBe(true);
  });

  it("provides a stable semantic main target for the skip link", () => {
    renderApp();

    const main = screen.getByRole("main");
    expect(main.tagName).toBe("MAIN");
    expect(main.id).toBe("main-content");
  });

  it("filters the library from the selected category", () => {
    renderApp();

    fireEvent.click(screen.getAllByRole("button", { name: "Từ vựng" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /Luyện tập/ }));

    expect(screen.getByText("Listening practice")).toBeTruthy();
    expect(screen.queryByText("Getting started")).toBeNull();
  });

  it("caps exam unlock progress at the passing score", () => {
    render(<ExamLibrary best={{ reading: 50, listening: 0, combined: 0 }} onStart={() => undefined} />);

    expect(screen.getByLabelText("Tiến độ 67%")).toBeTruthy();
  });

  it("marks unavailable library actions as disabled and labels its search input", () => {
    render(<LibraryPage title="Thư viện" description="Tài liệu" />);

    expect(screen.getByRole("textbox", { name: "Tìm trong thư viện" }).getAttribute("name")).toBe("library-search");
    expect(screen.getAllByRole("button", { name: /sắp có/i })[0].hasAttribute("disabled")).toBe(true);
  });

  it("exposes exam readiness with progressbar semantics", () => {
    render(<ExamLibrary best={{ reading: 50, listening: 0, combined: 0 }} onStart={() => undefined} />);

    const progress = screen.getByRole("progressbar", { name: "Tiến độ 67%" });
    expect(progress.getAttribute("aria-valuemin")).toBe("0");
    expect(progress.getAttribute("aria-valuemax")).toBe("100");
    expect(progress.getAttribute("aria-valuenow")).toBe("67");
  });

  it("opens a lesson in an accessible dialog and restores focus when it closes", () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: "Bài học" }));
    const lesson = screen.getByRole("button", { name: /Lesson 01/ });
    lesson.focus();
    fireEvent.click(lesson);

    expect(screen.getByRole("dialog", { name: /Lesson 01/ }).getAttribute("aria-modal")).toBe("true");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Đóng bài học" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(lesson);
    expect(document.body.style.overflow).toBe("");
  });

  it("keeps focus in the lesson dialog and closes it with Escape", () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: "Bài học" }));
    fireEvent.click(screen.getByRole("button", { name: /Lesson 01/ }));
    const close = screen.getByRole("button", { name: "Đóng bài học" });
    fireEvent.keyDown(close, { key: "Tab", shiftKey: true });

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Mở gói học" }));

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens and closes the display-only paywall dialog", () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: "Bài học" }));
    fireEvent.click(screen.getByRole("button", { name: /Lesson 01/ }));
    fireEvent.click(screen.getByRole("button", { name: "Mở gói học" }));

    expect(screen.getByRole("dialog", { name: "Mở khóa lộ trình TAPA" }).getAttribute("aria-modal")).toBe("true");

    fireEvent.keyDown(screen.getByRole("dialog", { name: "Mở khóa lộ trình TAPA" }), { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Mở khóa lộ trình TAPA" })).toBeNull();
    expect(screen.getByRole("dialog", { name: /Lesson 01/ })).toBeTruthy();
  });

  it("shows the full lesson sections and gives immediate feedback for each exercise answer", () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: "Bài học" }));
    fireEvent.click(screen.getByRole("button", { name: /Lesson 01/ }));

    expect(screen.getByRole("navigation", { name: "Mục lục bài học" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Từ vựng" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Ngữ pháp" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Bản dịch" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Ghi chú văn hóa" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Luyện tập" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Wait outside" }));
    expect(screen.getByText("Chưa đúng. Đáp án: The place is open.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "The place is open." }));
    expect(screen.getByText("Chính xác.")).toBeTruthy();
  });

  it("starts an exam, advances after an answer, and submits its score", () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: "Thi thử" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Bắt đầu đề" })[0]);

    expect(screen.getByRole("heading", { name: "A sign says ‘Staff only’. Who may enter?" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Only workers/ }).getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(screen.getByRole("button", { name: /Only workers/ }));
    fireEvent.click(screen.getByRole("button", { name: "Câu tiếp" }));

    expect(screen.getByRole("heading", { name: "A notice says ‘Closed at 18:00’. When should you arrive?" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Nộp bài sớm" }));

    expect(screen.getByRole("heading", { name: "Kết quả bài thi" })).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("records the submitted score and offers review, retry, and return actions", () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: "Thi thử" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Bắt đầu đề" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /Only workers/ }));
    fireEvent.click(screen.getByRole("button", { name: "Nộp bài sớm" }));

    fireEvent.click(screen.getByRole("button", { name: "Xem lại đáp án" }));
    expect(screen.getByRole("heading", { name: "Xem lại bài thi" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Quay lại kết quả" }));
    fireEvent.click(screen.getByRole("button", { name: "Làm lại" }));
    expect(screen.getByRole("heading", { name: "A sign says ‘Staff only’. Who may enter?" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Nộp bài sớm" }));
    fireEvent.click(screen.getByRole("button", { name: "Quay về danh sách đề" }));
    expect(screen.getByRole("heading", { name: "Chọn đề phù hợp với bạn" })).toBeTruthy();
    expect(screen.getByText("5/100")).toBeTruthy();
  });

  it("advances a listening question after its second audio pass completes", async () => {
    renderApp();
    const play = mockAudioPlayback();

    fireEvent.click(screen.getByRole("button", { name: "Thi thử" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Bắt đầu đề" })[1]);
    expect(play).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Câu tiếp" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /A Morning/ }));
    await completeListeningAudio();

    expect(screen.getByRole("heading", { name: "The speaker asks for a name at the desk. What information is requested?" })).toBeTruthy();
    expect(play).toHaveBeenCalledTimes(3);
    expect(screen.getByText("Lượt 1/2")).toBeTruthy();
  });

  it("advances the combined exam's listening section after its second audio pass completes", async () => {
    renderApp();
    const play = mockAudioPlayback();

    fireEvent.click(screen.getByRole("button", { name: "Thi thử" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Bắt đầu đề" })[2]);
    for (let count = 0; count < 20; count += 1) {
      fireEvent.click(screen.getAllByRole("button", { name: /A / })[0]);
      fireEvent.click(screen.getByRole("button", { name: "Câu tiếp" }));
    }
    fireEvent.click(screen.getByRole("button", { name: "Chuyển ngay" }));
    expect(play).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Câu tiếp" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /A Morning/ }));
    await completeListeningAudio();

    expect(screen.getByRole("heading", { name: "The speaker asks for a name at the desk. What information is requested?" })).toBeTruthy();
    expect(play).toHaveBeenCalledTimes(3);
    expect(screen.getByText("Lượt 1/2")).toBeTruthy();
  });

  it("advances a completed listening item when its answer is selected afterwards", async () => {
    renderApp();
    const play = mockAudioPlayback();

    fireEvent.click(screen.getByRole("button", { name: "Thi thử" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Bắt đầu đề" })[1]);
    await completeListeningAudio();

    expect(screen.getByText("Đã phát xong hai lượt.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /A Morning/ }));
    await act(async () => undefined);

    expect(screen.getByRole("heading", { name: "The speaker asks for a name at the desk. What information is requested?" })).toBeTruthy();
    expect(play).toHaveBeenCalledTimes(3);
    expect(screen.getByText("Lượt 1/2")).toBeTruthy();
  });
});
