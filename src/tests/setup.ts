import "@testing-library/svelte/vitest";
import { vi } from "vitest";

// Mock $app/stores
vi.mock("$app/stores", () => ({
  page: {
    subscribe: vi.fn((callback) => {
      callback({
        url: new URL("http://localhost"),
        params: {},
        data: { user: null },
      });
      return () => {};
    }),
  },
  navigating: {
    subscribe: vi.fn((callback) => {
      callback(null);
      return () => {};
    }),
  },
}));

// Mock $app/navigation
vi.mock("$app/navigation", () => ({
  goto: vi.fn(),
  invalidate: vi.fn(),
  invalidateAll: vi.fn(),
  preloadData: vi.fn(),
  preloadCode: vi.fn(),
}));

// Mock better-auth client
vi.mock("$lib/auth-client", () => ({
  authClient: {
    signIn: { email: vi.fn() },
    signUp: { email: vi.fn() },
    signOut: vi.fn(),
  },
}));
