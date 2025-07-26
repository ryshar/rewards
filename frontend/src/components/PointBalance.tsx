import type { User } from "@/types";

export function PointBalance({ user }: { user: User | null }) {
  return (
    <div className="max-w-2xl mx-auto flex items-center justify-between mb-8">
      <h2 className="text-2xl font-medium">
        Welcome <span className="font-bold">{user?.name ?? "Loading..."}</span>
      </h2>
      <div className="bg-primary/10 px-6 py-3 rounded-full">
        <span className="text-xl font-medium">
          {user?.point_balance ?? "-"}
        </span>
        <span className="ml-2 text-muted-foreground">points available</span>
      </div>
    </div>
  );
}
