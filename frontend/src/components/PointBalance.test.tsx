import "@testing-library/jest-dom";
import { render, screen } from "@/test/test-utils";
import { PointBalance } from "./PointBalance";
import type { User } from "@/types";

const mockUser: User = {
  id: 1,
  name: "John",
  email: "john@example.com",
  point_balance: 150,
};

describe("PointBalance", () => {
  it("renders user name and point balance when user is provided", () => {
    render(<PointBalance user={mockUser} />);

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("points available")).toBeInTheDocument();
  });

  it("renders loading state when user is null", () => {
    render(<PointBalance user={null} />);

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByText("points available")).toBeInTheDocument();
  });
});
