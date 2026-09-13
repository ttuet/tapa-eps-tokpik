import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useListeningAudio } from "../hooks/use-listening-audio";

function createAudio() {
  return {
    currentTime: 0,
    pause: vi.fn(),
    play: vi.fn(() => Promise.resolve()),
  } as unknown as HTMLAudioElement;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("useListeningAudio", () => {
  it("plays the selected range from its start on the first pass", async () => {
    const audio = createAudio();
    const { result } = renderHook(() =>
      useListeningAudio({ audio, startSeconds: 12, endSeconds: 15, onFinished: vi.fn() }),
    );

    await act(async () => {
      await result.current.playCurrent();
    });

    expect(audio.currentTime).toBe(12);
    expect(audio.play).toHaveBeenCalledTimes(1);
    expect(result.current).toMatchObject({ playing: true, pass: 1 });
  });

  it("replays once when the first pass reaches the end", async () => {
    const audio = createAudio();
    const { result } = renderHook(() =>
      useListeningAudio({ audio, startSeconds: 12, endSeconds: 15, onFinished: vi.fn() }),
    );

    await act(async () => {
      await result.current.playCurrent();
    });
    audio.currentTime = 15;
    await act(async () => {
      await result.current.onTimeUpdate();
    });

    expect(audio.currentTime).toBe(12);
    expect(audio.play).toHaveBeenCalledTimes(2);
    expect(result.current).toMatchObject({ playing: true, pass: 2 });
  });

  it("pauses after the second pass and finishes after a short delay", async () => {
    vi.useFakeTimers();
    const audio = createAudio();
    const onFinished = vi.fn();
    const { result } = renderHook(() =>
      useListeningAudio({ audio, startSeconds: 12, endSeconds: 15, onFinished }),
    );

    await act(async () => {
      await result.current.playCurrent();
    });
    audio.currentTime = 15;
    await act(async () => {
      await result.current.onTimeUpdate();
    });
    audio.currentTime = 15;
    await act(async () => {
      await result.current.onTimeUpdate();
    });

    expect(audio.pause).toHaveBeenCalledTimes(1);
    expect(result.current.playing).toBe(false);
    act(() => vi.advanceTimersByTime(899));
    expect(onFinished).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onFinished).toHaveBeenCalledTimes(1);
  });

  it("resets playing when the browser rejects playback", async () => {
    const audio = createAudio();
    vi.mocked(audio.play).mockRejectedValueOnce(new Error("autoplay blocked"));
    const { result } = renderHook(() =>
      useListeningAudio({ audio, startSeconds: 12, endSeconds: 15, onFinished: vi.fn() }),
    );

    await act(async () => {
      await result.current.playCurrent();
    });

    expect(result.current).toMatchObject({ playing: false, pass: 0 });
  });

  it("pauses and cancels a pending finish when stopped, unmounted, or changed to another question", async () => {
    vi.useFakeTimers();
    const audio = createAudio();
    const onFinished = vi.fn();
    const { result, rerender, unmount } = renderHook(
      ({ startSeconds, endSeconds }) => useListeningAudio({ audio, startSeconds, endSeconds, onFinished }),
      { initialProps: { startSeconds: 12, endSeconds: 15 } },
    );

    await act(async () => {
      await result.current.playCurrent();
    });
    audio.currentTime = 15;
    await act(async () => {
      await result.current.onTimeUpdate();
    });
    audio.currentTime = 15;
    await act(async () => {
      await result.current.onTimeUpdate();
    });
    act(() => result.current.stop());
    act(() => vi.advanceTimersByTime(900));
    expect(onFinished).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({ playing: false, pass: 0 });

    await act(async () => {
      await result.current.playCurrent();
    });
    audio.currentTime = 15;
    await act(async () => {
      await result.current.onTimeUpdate();
    });
    audio.currentTime = 15;
    await act(async () => {
      await result.current.onTimeUpdate();
    });
    rerender({ startSeconds: 20, endSeconds: 23 });
    act(() => vi.advanceTimersByTime(900));
    expect(onFinished).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({ playing: false, pass: 0 });

    await act(async () => {
      await result.current.playCurrent();
    });
    audio.currentTime = 23;
    await act(async () => {
      await result.current.onTimeUpdate();
    });
    audio.currentTime = 23;
    await act(async () => {
      await result.current.onTimeUpdate();
    });
    unmount();
    act(() => vi.advanceTimersByTime(1_000));
    expect(onFinished).not.toHaveBeenCalled();
    expect(audio.pause).toHaveBeenCalled();
  });
});
