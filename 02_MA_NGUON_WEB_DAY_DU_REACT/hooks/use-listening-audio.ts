"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseListeningAudioOptions {
  audio: HTMLAudioElement | null;
  startSeconds: number;
  endSeconds: number;
  onFinished: () => void;
}

export function useListeningAudio({
  audio,
  startSeconds,
  endSeconds,
  onFinished,
}: UseListeningAudioOptions) {
  const [playing, setPlaying] = useState(false);
  const [pass, setPass] = useState(0);
  const playingRef = useRef(false);
  const passRef = useRef(0);
  const finishTimerRef = useRef<number | undefined>(undefined);
  const playbackIdRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onFinishedRef = useRef(onFinished);

  const clearFinishTimer = useCallback(() => {
    if (finishTimerRef.current !== undefined) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = undefined;
    }
  }, []);

  const reset = useCallback(() => {
    playbackIdRef.current += 1;
    clearFinishTimer();
    audioRef.current?.pause();
    playingRef.current = false;
    passRef.current = 0;
    setPlaying(false);
    setPass(0);
  }, [clearFinishTimer]);

  const playPass = useCallback(async (nextPass: number) => {
    const currentAudio = audioRef.current;
    if (!currentAudio) {
      return;
    }

    clearFinishTimer();
    const playbackId = playbackIdRef.current + 1;
    playbackIdRef.current = playbackId;
    currentAudio.currentTime = startSeconds;
    playingRef.current = true;
    passRef.current = nextPass;
    setPlaying(true);
    setPass(nextPass);

    try {
      await currentAudio.play();
    } catch {
      if (playbackIdRef.current !== playbackId) {
        return;
      }

      playingRef.current = false;
      passRef.current = 0;
      setPlaying(false);
      setPass(0);
    }
  }, [clearFinishTimer, startSeconds]);

  const playCurrent = useCallback(() => playPass(1), [playPass]);

  const onTimeUpdate = useCallback(async () => {
    const currentAudio = audioRef.current;
    if (!currentAudio || !playingRef.current || currentAudio.currentTime < endSeconds) {
      return;
    }

    if (passRef.current === 1) {
      await playPass(2);
      return;
    }

    if (passRef.current !== 2) {
      return;
    }

    playbackIdRef.current += 1;
    currentAudio.pause();
    playingRef.current = false;
    setPlaying(false);
    clearFinishTimer();
    finishTimerRef.current = window.setTimeout(() => {
      finishTimerRef.current = undefined;
      onFinishedRef.current();
    }, 900);
  }, [clearFinishTimer, endSeconds, playPass]);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    audioRef.current = audio;
    return reset;
  }, [audio, endSeconds, reset, startSeconds]);

  return { playing, pass, playCurrent, onTimeUpdate, stop: reset };
}
