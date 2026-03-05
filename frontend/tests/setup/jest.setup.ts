import "@testing-library/jest-dom";
import React from "react";

/* --------------------------------
   Safe helpers
--------------------------------- */
const hasWindow = typeof window !== "undefined";

/* --------------------------------
   next/image -> render as <img> (strip Next-only props)
--------------------------------- */
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const {
      fill, // Next-only
      priority, // Next-only
      sizes, // Next-only
      quality, // Next-only
      placeholder, // Next-only
      blurDataURL, // Next-only
      loader, // Next-only
      onLoadingComplete, // Next-only
      ...rest
    } = props ?? {};

    // Avoid passing boolean "fill/priority" into DOM -> removes console errors
    return React.createElement("img", {
      ...rest,
      alt: rest?.alt ?? "image",
    });
  },
}));

/* --------------------------------
   next/link -> render as <a>
--------------------------------- */
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => {
    const resolvedHref = typeof href === "string" ? href : href?.pathname ?? "";
    return React.createElement("a", { href: resolvedHref, ...rest }, children);
  },
}));

/* --------------------------------
   next/navigation hooks (shared)
--------------------------------- */
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

/* --------------------------------
   react-dom createPortal -> inline render (jsdom tests)
   (safe even in node)
--------------------------------- */
jest.mock("react-dom", () => {
  const actual = jest.requireActual("react-dom");
  return {
    ...actual,
    createPortal: (node: any) => node,
  };
});

/* --------------------------------
   lucide-react icons -> lightweight stubs
--------------------------------- */
jest.mock("lucide-react", () =>
  new Proxy(
    {},
    {
      get: () => () => React.createElement("span", null),
    }
  )
);

/* --------------------------------
   Browser APIs (guarded for node)
--------------------------------- */
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(global as any).ResizeObserver = (global as any).ResizeObserver || ResizeObserverMock;
(global as any).IntersectionObserver =
  (global as any).IntersectionObserver || IntersectionObserverMock;

// ✅ IMPORTANT: guard window usage so node tests don't crash
if (hasWindow) {
  (window as any).scrollTo = (window as any).scrollTo || jest.fn();
}