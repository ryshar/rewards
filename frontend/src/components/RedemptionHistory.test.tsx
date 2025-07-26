import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@/test/test-utils";
import { RedemptionHistory } from "./RedemptionHistory";
import { useAuth } from "@/lib/auth-context";
import { fetchRedemptions } from "@/lib/api";
import type { Redemption } from "@/types";

jest.mock("@/lib/auth-context");
jest.mock("@/lib/api");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockFetchRedemptions = fetchRedemptions as jest.MockedFunction<
  typeof fetchRedemptions
>;

const mockRedemptions: Redemption[] = [
  {
    id: 1,
    reward: { name: "10% Off" },
    amount: 50,
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    reward: { name: "$5 Off" },
    amount: 100,
    created_at: "2024-01-10T14:45:00Z",
  },
];

describe("RedemptionHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseAuth.mockReturnValue({
      token: "mock-token",
      setToken: jest.fn(),
    });
    mockFetchRedemptions.mockImplementation(() => new Promise(() => {}));

    render(<RedemptionHistory />);

    expect(
      screen.getByText("Loading redemption history...")
    ).toBeInTheDocument();
  });

  it("renders error state when fetch fails", async () => {
    mockUseAuth.mockReturnValue({
      token: "mock-token",
      setToken: jest.fn(),
    });
    mockFetchRedemptions.mockRejectedValue(new Error("Network error"));

    render(<RedemptionHistory />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load redemption history")
      ).toBeInTheDocument();
    });
  });

  it("renders empty state when no redemptions", async () => {
    mockUseAuth.mockReturnValue({
      token: "mock-token",
      setToken: jest.fn(),
    });
    mockFetchRedemptions.mockResolvedValue([]);

    render(<RedemptionHistory />);

    await waitFor(() => {
      expect(screen.getByText("No redemptions yet")).toBeInTheDocument();
    });
  });

  it("renders redemptions table with data", async () => {
    mockUseAuth.mockReturnValue({
      token: "mock-token",
      setToken: jest.fn(),
    });
    mockFetchRedemptions.mockResolvedValue(mockRedemptions);

    render(<RedemptionHistory />);

    await waitFor(() => {
      expect(screen.getByText("10% Off")).toBeInTheDocument();
      expect(screen.getByText("$5 Off")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    expect(screen.getByText("Reward")).toBeInTheDocument();
    expect(screen.getByText("Points")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
  });
});
