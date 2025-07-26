import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@/test/test-utils";
import App from "./App";
import { useAuth } from "@/lib/auth-context";
import {
  fetchCurrentUser,
  fetchUsers,
  fetchRewards,
  fetchRedemptions,
} from "@/lib/api";
import type { User } from "@/types";

// Mock the dependencies
jest.mock("@/lib/auth-context");
jest.mock("@/lib/api");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockFetchCurrentUser = fetchCurrentUser as jest.MockedFunction<
  typeof fetchCurrentUser
>;
const mockFetchUsers = fetchUsers as jest.MockedFunction<typeof fetchUsers>;
const mockFetchRewards = fetchRewards as jest.MockedFunction<
  typeof fetchRewards
>;
const mockFetchRedemptions = fetchRedemptions as jest.MockedFunction<
  typeof fetchRedemptions
>;

const mockUser: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  point_balance: 150,
};

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchUsers.mockResolvedValue([]);
    mockFetchRewards.mockResolvedValue([]);
    mockFetchRedemptions.mockResolvedValue([]);
  });

  it("renders loading state initially when authenticated", () => {
    mockUseAuth.mockReturnValue({
      token: "mock-token",
      setToken: jest.fn(),
    });
    mockFetchCurrentUser.mockImplementation(() => new Promise(() => {}));

    render(<App />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders Users component when not authenticated", () => {
    mockUseAuth.mockReturnValue({
      token: null,
      setToken: jest.fn(),
    });

    render(<App />);

    expect(screen.getByText("Rewards")).toBeInTheDocument();
    expect(screen.getByText("Select a user")).toBeInTheDocument();
  });

  it("renders authenticated content when user data loads", async () => {
    mockUseAuth.mockReturnValue({
      token: "mock-token",
      setToken: jest.fn(),
    });
    mockFetchCurrentUser.mockResolvedValue(mockUser);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Rewards")).toBeInTheDocument();
      expect(screen.getByText("Welcome")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
  });
});
