import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@/test/test-utils";
import { RewardsList } from "./RewardsList";
import { useAuth } from "@/lib/auth-context";
import { fetchRewards, createRedemption } from "@/lib/api";
import { toast } from "sonner";
import type { User, Reward } from "@/types";

jest.mock("@/lib/auth-context");
jest.mock("@/lib/api");
jest.mock("sonner");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockFetchRewards = fetchRewards as jest.MockedFunction<
  typeof fetchRewards
>;
const mockCreateRedemption = createRedemption as jest.MockedFunction<
  typeof createRedemption
>;
const mockToast = toast as jest.Mocked<typeof toast>;

const mockUser: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  point_balance: 150,
};

const mockRewards: Reward[] = [
  {
    id: 1,
    name: "10% Off",
    description: "10% Off on any purchase",
    cost: 50,
  },
  {
    id: 2,
    name: "$5 Off",
    description: "$5 Off on any purchase",
    cost: 100,
  },
  {
    id: 3,
    name: "BOGO",
    description: "Buy one get one free",
    cost: 200,
  },
];

describe("RewardsList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      token: "mock-token",
      setToken: jest.fn(),
    });
  });

  it("renders loading state", () => {
    mockFetchRewards.mockImplementation(() => new Promise(() => {}));

    render(<RewardsList user={mockUser} />);

    expect(screen.getByText("Loading rewards...")).toBeInTheDocument();
  });

  it("renders error state when fetch fails", async () => {
    mockFetchRewards.mockRejectedValue(new Error("Network error"));

    render(<RewardsList user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load rewards")).toBeInTheDocument();
    });
  });

  it("renders empty state when no rewards", async () => {
    mockFetchRewards.mockResolvedValue([]);

    render(<RewardsList user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText("No rewards available")).toBeInTheDocument();
    });
  });

  it("renders rewards list with data", async () => {
    mockFetchRewards.mockResolvedValue(mockRewards);

    render(<RewardsList user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText("10% Off")).toBeInTheDocument();
      expect(screen.getByText("10% Off on any purchase")).toBeInTheDocument();
      expect(screen.getByText("$5 Off")).toBeInTheDocument();
      expect(screen.getByText("$5 Off on any purchase")).toBeInTheDocument();
      expect(screen.getByText("BOGO")).toBeInTheDocument();
      expect(screen.getByText("Buy one get one free")).toBeInTheDocument();
      expect(screen.getByText("50 points")).toBeInTheDocument();
      expect(screen.getByText("100 points")).toBeInTheDocument();
      expect(screen.getByText("200 points")).toBeInTheDocument();
    });
  });

  it("disables redeem button when user has insufficient points", async () => {
    mockFetchRewards.mockResolvedValue(mockRewards);

    render(<RewardsList user={mockUser} />);

    await waitFor(() => {
      const redeemButtons = screen.getAllByText("Redeem");

      expect(redeemButtons[0]).toBeEnabled();
      expect(redeemButtons[1]).toBeEnabled();
      expect(redeemButtons[2]).toBeDisabled();
    });
  });

  it("opens confirmation dialog when redeem button is clicked", async () => {
    mockFetchRewards.mockResolvedValue(mockRewards);

    render(<RewardsList user={mockUser} />);

    await waitFor(() => {
      const firstRedeemButton = screen.getAllByText("Redeem")[0];
      fireEvent.click(firstRedeemButton);
    });

    expect(screen.getByText("Confirm Redemption")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to redeem 10% Off for 50 points?/)
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("closes dialog when cancel is clicked", async () => {
    mockFetchRewards.mockResolvedValue(mockRewards);

    render(<RewardsList user={mockUser} />);

    await waitFor(() => {
      const firstRedeemButton = screen.getAllByText("Redeem")[0];
      fireEvent.click(firstRedeemButton);
    });

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByText("Confirm Redemption")).not.toBeInTheDocument();
    });
  });

  it("handles successful redemption", async () => {
    mockFetchRewards.mockResolvedValue(mockRewards);
    mockCreateRedemption.mockResolvedValue(undefined);

    render(<RewardsList user={mockUser} />);

    await waitFor(() => {
      const firstRedeemButton = screen.getAllByText("Redeem")[0];
      fireEvent.click(firstRedeemButton);
    });

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(mockCreateRedemption).toHaveBeenCalledWith("mock-token", 1);
      expect(mockToast.success).toHaveBeenCalledWith("Successfully redeemed");
    });
  });

  it("handles redemption error", async () => {
    mockFetchRewards.mockResolvedValue(mockRewards);
    mockCreateRedemption.mockRejectedValue(new Error("Redemption failed"));

    render(<RewardsList user={mockUser} />);

    await waitFor(() => {
      const firstRedeemButton = screen.getAllByText("Redeem")[0];
      fireEvent.click(firstRedeemButton);
    });

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "Failed to redeem. Please try again."
      );
    });
  });
});
