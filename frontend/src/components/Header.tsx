import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/lib/api";
import { toast } from "sonner";

export function Header() {
  const { token, setToken } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: () => {
      if (!token) throw new Error("No authentication token");
      return logout(token);
    },
    onSuccess: () => {
      setToken(null);
    },
    onError: () => {
      toast.error("Failed to sign out. Please try again.");
    },
  });

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rewards</h1>
        {token && (
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={logoutMutation.isPending || !token}
          >
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </Button>
        )}
      </div>
    </header>
  );
}
