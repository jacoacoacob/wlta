import { it, expect } from "vitest";
import { mapKeys } from "./map-keys";


  const mockData = [
    { name: "", age: 3, height: 9 },
    { name: "", age: 3, height: 9 },
    { name: "", age: 3, height: 9 },
    { not: "", like: 3, theOthers: true },
  ]

  it("returns the expected value", () => {
    const result = mapKeys(mockData, "age", "height");

    expect(result).toHaveLength(mockData.length);
  })
