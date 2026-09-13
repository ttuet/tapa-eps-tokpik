import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useExamSession } from "../hooks/use-exam-session";

afterEach(() => {
  vi.useRealTimers();
});

describe("useExamSession", () => {
  it("stores answers and requires an answer before advancing", () => {
    const { result } = renderHook(() => useExamSession());

    act(() => result.current.start("reading"));
    act(() => result.current.next());
    expect(result.current.currentIndex).toBe(0);

    act(() => result.current.answer("reading-01", 2));
    expect(result.current.answers["reading-01"]).toBe(2);
    act(() => result.current.next());
    expect(result.current.currentIndex).toBe(1);
  });

  it("pauses a combined exam at question 20 until listening is explicitly entered", () => {
    const { result } = renderHook(() => useExamSession());

    act(() => result.current.start("combined"));
    for (let question = 0; question < 19; question += 1) {
      act(() => result.current.answer(`reading-${String(question + 1).padStart(2, "0")}`, 0));
      act(() => result.current.next());
    }
    expect(result.current.currentIndex).toBe(19);

    act(() => result.current.answer("reading-20", 0));
    act(() => result.current.next());
    expect(result.current.phase).toBe("transition");
    expect(result.current.currentIndex).toBe(19);

    act(() => result.current.enterListening());
    expect(result.current.phase).toBe("active");
    expect(result.current.currentIndex).toBe(20);
    expect(result.current.questions[20]?.id).toBe("listening-01");
  });

  it("submits once when the timer reaches zero and exit discards the session", () => {
    vi.useFakeTimers();
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useExamSession({ onSubmit }));

    act(() => result.current.start("reading"));
    act(() => vi.advanceTimersByTime(1_500_000));
    expect(result.current.phase).toBe("submitted");
    expect(onSubmit).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(10_000));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    act(() => result.current.exit());
    expect(result.current.phase).toBe("idle");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("resets an active session on exit and does not submit after its timer would have expired", () => {
    vi.useFakeTimers();
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useExamSession({ onSubmit }));

    act(() => result.current.start("reading"));
    act(() => result.current.answer("reading-01", 1));
    act(() => result.current.exit());
    expect(result.current).toMatchObject({
      phase: "idle",
      kind: null,
      currentIndex: 0,
      answers: {},
      remainingSeconds: 0,
      result: null,
    });

    act(() => vi.advanceTimersByTime(1_500_000));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("cleans up its timer when unmounted", () => {
    vi.useFakeTimers();
    const onSubmit = vi.fn();
    const { result, unmount } = renderHook(() => useExamSession({ onSubmit }));

    act(() => result.current.start("reading"));
    unmount();
    act(() => vi.advanceTimersByTime(1_500_000));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
