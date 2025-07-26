import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "./components/Header";
import { PointBalance } from "./components/PointBalance";
import { RedemptionHistory } from "./components/RedemptionHistory";
import { RewardsList } from "./components/RewardsList";
import { Users } from "./components/Users";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "./lib/api";
import { useAuth } from "./lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const { token } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser", token],
    queryFn: () => (token ? fetchCurrentUser(token) : null),
    enabled: Boolean(token),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {token ? (
          <>
            <PointBalance user={user} />
            <Tabs defaultValue="rewards" className="max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
                <TabsTrigger value="history">Redemption History</TabsTrigger>
              </TabsList>
              <TabsContent value="rewards" className="mt-6">
                <RewardsList user={user} />
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <RedemptionHistory />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Users />
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;
