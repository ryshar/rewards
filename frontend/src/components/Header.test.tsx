import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@/test/test-utils";
import { Header } from "./Header";
import { useAuth } from "@/lib/auth-context";
import { logout } from "@/lib/api";

jest.mock("@/lib/auth-context");
jest.mock("@/lib/api");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockLogout = logout as jest.MockedFunction<typeof logout>;

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the app title", () => {
    mockUseAuth.mockReturnValue({
      token: null,
      setToken: jest.fn(),
    });

    render(<Header />);

    expect(screen.getByText("Rewards")).toBeInTheDocument();
  });

  it("does not show sign out button when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      token: null,
      setToken: jest.fn(),
    });

    render(<Header />);

    expect(screen.queryByText("Sign out")).not.toBeInTheDocument();
  });

  it("shows sign out button when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      token: "mock-token",
      setToken: jest.fn(),
    });

    render(<Header />);

    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("calls logout function when sign out button is clicked", async () => {
    mockUseAuth.mockReturnValue({
      token: "mock-token",
      setToken: jest.fn(),
    });
    mockLogout.mockResolvedValue(undefined);

    render(<Header />);

    const signOutButton = screen.getByText("Sign out");
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith("mock-token");
    });
  });
});
