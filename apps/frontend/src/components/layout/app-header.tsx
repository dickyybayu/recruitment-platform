import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/auth/logout-button";
import type { CurrentUser } from "@/types/auth";

export function AppHeader({ user }: { user: CurrentUser }) {
  return (
    <header className="flex min-h-16 flex-col gap-3 border-b bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{user.fullName}</p>
        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary">{user.role}</Badge>
        <LogoutButton />
      </div>
    </header>
  );
}
