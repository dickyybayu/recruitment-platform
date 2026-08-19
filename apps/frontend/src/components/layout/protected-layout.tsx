"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { useCurrentUser } from "@/hooks/use-current-user";
import { isApiError } from "@/lib/api";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    data: user,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useCurrentUser();

  const isUnauthorized = isApiError(error) && error.status === 401;

  useEffect(() => {
    if (isUnauthorized) {
      router.replace("/login");
    }
  }, [isUnauthorized, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto flex max-w-[1440px] gap-6">
          <Skeleton className="hidden h-[calc(100vh-3rem)] w-64 md:block" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isUnauthorized || (!isError && !user)) {
    return null;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto w-full max-w-3xl">
          <ErrorState
            title="Unable to verify your session"
            message="We could not reach the authentication service. Check the backend connection and try again."
            onRetry={() => void refetch()}
          />
          {isFetching && (
            <p className="mt-3 text-sm text-muted-foreground">
              Retrying session check...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 md:flex">
      <AppSidebar user={user} />
      <div className="min-w-0 flex-1">
        <AppHeader user={user} />
        <main className="mx-auto w-full max-w-[1440px] p-5 sm:p-7 lg:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}
