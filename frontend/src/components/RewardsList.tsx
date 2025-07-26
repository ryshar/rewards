import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRewards, createRedemption } from "@/lib/api";
import type { User, Reward } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

export function RewardsList({ user }: { user: User | null }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const queryClient = useQueryClient();

  const {
    data: rewards,
    isLoading,
    error,
  } = useQuery<Reward[]>({
    queryKey: ["rewards"],
    queryFn: () => {
      if (!token) throw new Error("No authentication token");
      return fetchRewards(token);
    },
    enabled: Boolean(token),
  });

  const redeemMutation = useMutation({
    mutationFn: (rewardId: number) => {
      if (!token) throw new Error("No authentication token");
      return createRedemption(token, rewardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(`Successfully redeemed`);
      setOpen(false);
    },
    onError: () => {
      toast.error(`Failed to redeem. Please try again.`);
      setOpen(false);
    },
  });

  const handleRedeem = (reward: Reward) => {
    setSelectedReward(reward);
    setOpen(true);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;
    redeemMutation.mutate(selectedReward.id);
  };

  if (isLoading) return <div>Loading rewards...</div>;
  if (error) return <div className="text-red-500">Failed to load rewards</div>;
  if (!rewards?.length) return <div>No rewards available</div>;

  return (
    <div className="space-y-4">
      {rewards.map((reward) => (
        <Card key={reward.id}>
          <CardHeader>
            <CardTitle>{reward.name}</CardTitle>
            <CardDescription>{reward.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end items-center gap-4">
            <span className="text-lg font-medium">{reward.cost} points</span>
            <Button
              onClick={() => handleRedeem(reward)}
              disabled={Boolean((user?.point_balance ?? 0) < reward.cost)}
            >
              Redeem
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem {selectedReward?.name} for{" "}
              {selectedReward?.cost} points?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRedeem} disabled={redeemMutation.isPending}>
              {redeemMutation.isPending ? "Redeeming..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
