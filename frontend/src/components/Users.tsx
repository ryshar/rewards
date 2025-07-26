import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchUsers, login } from "@/lib/api";
import type { User } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function Users() {
  const { setToken } = useAuth();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token);
    },
  });

  const handleLogin = async (userId: number) => {
    await loginMutation.mutateAsync(userId);
  };

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Select a user</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select a user</CardTitle>
        {error && (
          <CardDescription className="text-red-500">
            Failed to load users
          </CardDescription>
        )}
        {loginMutation.isError && (
          <CardDescription className="text-red-500">
            Failed to login. Please try again.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!users?.length ? (
            <div>No users available</div>
          ) : (
            users.map((user: User) => {
              const isLoggingIn =
                loginMutation.isPending && loginMutation.variables === user.id;

              return (
                <Button
                  key={user.id}
                  onClick={() => handleLogin(user.id)}
                  className="w-full text-left flex items-center justify-between"
                  variant="outline"
                  disabled={loginMutation.isPending}
                >
                  <span>{user.name}</span>
                  <span className="text-sm text-gray-500">
                    {isLoggingIn ? "Logging in..." : user.email}
                  </span>
                </Button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
