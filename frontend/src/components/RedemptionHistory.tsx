import { useQuery } from "@tanstack/react-query";
import { fetchRedemptions } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Redemption } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RedemptionHistory() {
  const { token } = useAuth();

  const {
    data: redemptions,
    isLoading,
    error,
  } = useQuery<Redemption[]>({
    queryKey: ["redemptions", token],
    queryFn: () => {
      if (!token) throw new Error("No authentication token");
      return fetchRedemptions(token);
    },
    enabled: Boolean(token),
  });

  if (isLoading) return <div>Loading redemption history...</div>;
  if (error)
    return (
      <div className="text-red-500">Failed to load redemption history</div>
    );
  if (!redemptions?.length) return <div>No redemptions yet</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reward</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {redemptions.map((redemption: Redemption) => (
          <TableRow key={redemption.id}>
            <TableCell>{redemption.reward.name}</TableCell>
            <TableCell>{redemption.amount}</TableCell>
            <TableCell>
              {new Date(redemption.created_at).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
