// tests/api/media.test.ts
import { toUploadsPath } from "@/lib/utils/media";

describe("toUploadsPath", () => {
  test("returns empty string for null/undefined/empty", () => {
    expect(toUploadsPath()).toBe("");
    expect(toUploadsPath(null)).toBe("");
    expect(toUploadsPath("")).toBe("");
    expect(toUploadsPath("   ")).toBe("");
  });

  test("strips android emulator base url (10.0.2.2)", () => {
    expect(toUploadsPath("http://10.0.2.2:5000/uploads/a.png")).toBe("/uploads/a.png");
  });

  test("strips 127.0.0.1 base url", () => {
    expect(toUploadsPath("http://127.0.0.1:5000/uploads/a.png")).toBe("/uploads/a.png");
  });

  test("strips localhost base url", () => {
    expect(toUploadsPath("http://localhost:5000/uploads/a.png")).toBe("/uploads/a.png");
  });

  test("keeps /uploads/ path", () => {
    expect(toUploadsPath("/uploads/a.png")).toBe("/uploads/a.png");
  });

  test("adds leading slash to uploads/ path", () => {
    expect(toUploadsPath("uploads/a.png")).toBe("/uploads/a.png");
  });

  test("returns unchanged for other urls", () => {
    expect(toUploadsPath("https://cdn.com/a.png")).toBe("https://cdn.com/a.png");
    expect(toUploadsPath("/something/else.png")).toBe("/something/else.png");
  });
});