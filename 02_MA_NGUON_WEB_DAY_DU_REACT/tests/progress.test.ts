import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { parseProgress, useProgress } from "../hooks/use-progress";

let storage: Storage;
let originalLocalStorageDescriptor: PropertyDescriptor | undefined;

beforeEach(() => {
  originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
  const values = new Map<string, string>();
  storage = {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
  Object.defineProperty(window, "localStorage", { configurable: true, value: storage });
});

afterEach(() => {
  storage.clear();
  if (originalLocalStorageDescriptor) {
    Object.defineProperty(window, "localStorage", originalLocalStorageDescriptor);
  } else {
    delete (window as { localStorage?: Storage }).localStorage;
  }
});

describe("parseProgress", () => {
  it("returns saved best scores from the current progress format", () => {
    expect(parseProgress(JSON.stringify({
      version: 1,
      best: { reading: 55, listening: 60, combined: 120 },
    }))).toEqual({ reading: 55, listening: 60, combined: 120 });
  });

  it("returns zero scores for malformed, obsolete, or incomplete data", () => {
    expect(parseProgress("not json")).toEqual({ reading: 0, listening: 0, combined: 0 });
    expect(parseProgress(JSON.stringify({ version: 0, best: { reading: 1, listening: 2, combined: 3 } }))).toEqual({ reading: 0, listening: 0, combined: 0 });
    expect(parseProgress(JSON.stringify({ version: 1, best: { reading: 1, listening: 2 } }))).toEqual({ reading: 0, listening: 0, combined: 0 });
  });
});

describe("useProgress", () => {
  it("loads saved scores after mounting and only retains score improvements", async () => {
    storage.setItem("tapa-progress", JSON.stringify({
      version: 1,
      best: { reading: 20, listening: 25, combined: 40 },
    }));
    const { result } = renderHook(() => useProgress());

    await waitFor(() => expect(result.current.best).toEqual({ reading: 20, listening: 25, combined: 40 }));

    act(() => result.current.recordScore("reading", 15));
    expect(result.current.best.reading).toBe(20);

    act(() => result.current.recordScore("reading", 30));
    expect(result.current.best.reading).toBe(30);
    expect(parseProgress(storage.getItem("tapa-progress"))).toEqual({
      reading: 30,
      listening: 25,
      combined: 40,
    });
  });
});
