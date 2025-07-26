import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

// Define global variable that Vite normally provides
declare global {
  const __API_URL__: string;
}

// Mock the API_URL for tests
(globalThis as typeof globalThis & { __API_URL__: string }).__API_URL__ =
  "http://localhost:3000";

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  })),
});

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  })),
});

afterEach(() => {
  cleanup();
});
