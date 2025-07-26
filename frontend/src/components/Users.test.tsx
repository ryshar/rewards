import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@/test/test-utils";
import { Users } from "./Users";
import { useAuth } from "@/lib/auth-context";
import { fetchUsers, login } from "@/lib/api";
import type { User } from "@/types";

// Mock the dependencies
jest.mock("@/lib/auth-context");
jest.mock("@/lib/api");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockFetchUsers = fetchUsers as jest.MockedFunction<typeof fetchUsers>;
const mockLogin = login as jest.MockedFunction<typeof login>;

const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    point_balance: 150,
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    point_balance: 200,
  },
];

describe("Users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state with skeletons", () => {
    const mockSetToken = jest.fn();
    mockUseAuth.mockReturnValue({
      token: null,
      setToken: mockSetToken,
    });
    mockFetchUsers.mockImplementation(() => new Promise(() => {}));

    render(<Users />);

    expect(screen.getByText("Select a user")).toBeInTheDocument();
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error state when fetch fails", async () => {
    const mockSetToken = jest.fn();
    mockUseAuth.mockReturnValue({
      token: null,
      setToken: mockSetToken,
    });
    mockFetchUsers.mockRejectedValue(new Error("Network error"));

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load users")).toBeInTheDocument();
    });
  });

  it("renders empty state when no users", async () => {
    const mockSetToken = jest.fn();
    mockUseAuth.mockReturnValue({
      token: null,
      setToken: mockSetToken,
    });
    mockFetchUsers.mockResolvedValue([]);

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText("No users available")).toBeInTheDocument();
    });
  });

  it("renders users list when data is loaded", async () => {
    const mockSetToken = jest.fn();
    mockUseAuth.mockReturnValue({
      token: null,
      setToken: mockSetToken,
    });
    mockFetchUsers.mockResolvedValue(mockUsers);

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("alice@example.com")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    });
  });

  it("calls login when user button is clicked", async () => {
    const mockSetToken = jest.fn();
    mockUseAuth.mockReturnValue({
      token: null,
      setToken: mockSetToken,
    });
    mockFetchUsers.mockResolvedValue(mockUsers);
    mockLogin.mockResolvedValue({ token: "new-token" });

    render(<Users />);

    await waitFor(() => {
      const aliceButton = screen.getByText("Alice").closest("button");
      expect(aliceButton).toBeInTheDocument();
      fireEvent.click(aliceButton!);
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(1);
    });
  });

  it("sets token on successful login", async () => {
    const mockSetToken = jest.fn();
    mockUseAuth.mockReturnValue({
      token: null,
      setToken: mockSetToken,
    });
    mockFetchUsers.mockResolvedValue(mockUsers);
    mockLogin.mockResolvedValue({ token: "new-token" });

    render(<Users />);

    await waitFor(() => {
      const aliceButton = screen.getByText("Alice").closest("button");
      fireEvent.click(aliceButton!);
    });

    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith("new-token");
    });
  });
});
