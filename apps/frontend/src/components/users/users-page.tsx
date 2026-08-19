"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { CreateUserForm } from "@/components/users/create-user-form";
import { UsersTable } from "@/components/users/users-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUsers } from "@/hooks/use-users";

export function UsersPage() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const usersQuery = useUsers(currentUser.data?.role === "ADMIN");

  useEffect(() => {
    if (currentUser.data?.role === "RECRUITER") {
      router.replace("/dashboard");
    }
  }, [currentUser.data?.role, router]);

  if (currentUser.isLoading || usersQuery.isLoading) {
    return <LoadingState label="Loading users..." />;
  }

  if (currentUser.data?.role !== "ADMIN") {
    return null;
  }

  if (usersQuery.isError) {
    return (
      <ErrorState
        title="Unable to load users"
        message={usersQuery.error.message}
        onRetry={() => void usersQuery.refetch()}
      />
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-base text-muted-foreground">Manage recruiters in your company.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="space-y-1 p-5 sm:p-6">
          <CardTitle className="text-xl">Create recruiter</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add a recruiter account for this company.
          </p>
        </CardHeader>
        <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
          <CreateUserForm />
        </CardContent>
      </Card>

      {usersQuery.data?.length === 0 ? (
        <EmptyState title="No users" />
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <UsersTable users={usersQuery.data ?? []} />
        </div>
      )}
    </section>
  );
}
