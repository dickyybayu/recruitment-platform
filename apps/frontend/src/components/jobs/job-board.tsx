"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { JobCard } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePublicPositions } from "@/hooks/use-public-positions";
import { positionTypes, type PositionType, type PublicPositionFilters } from "@/types/position";

type FilterForm = {
  search: string;
  location: string;
  type: "" | PositionType;
};

export function JobBoard() {
  const [form, setForm] = useState<FilterForm>({
    search: "",
    location: "",
    type: "",
  });
  const [filters, setFilters] = useState<PublicPositionFilters>({});
  const jobsQuery = usePublicPositions(filters);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <header className="mb-8 space-y-3 lg:mb-10">
        <div className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
          Open roles
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Job Board
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Browse open roles from companies hiring on the recruitment platform.
        </p>
      </header>

      <form
        className="mb-8 grid gap-4 rounded-lg border bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-[2fr_1.5fr_1fr_auto] lg:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          setFilters({
            search: form.search.trim() || undefined,
            location: form.location.trim() || undefined,
            type: form.type || undefined,
          });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            className="h-9"
            value={form.search}
            onChange={(event) => setForm((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Title or description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            className="h-9"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="Jakarta"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            value={form.type}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, type: event.target.value as FilterForm["type"] }))
            }
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">All types</option>
            {positionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit">
          <Search />
          Filter
        </Button>
      </form>

      {jobsQuery.isLoading && <LoadingState label="Loading jobs..." />}

      {jobsQuery.isError && (
        <ErrorState
          message={jobsQuery.error.message}
          onRetry={() => void jobsQuery.refetch()}
        />
      )}

      {jobsQuery.data && jobsQuery.data.length === 0 && (
        <EmptyState title="No jobs found" description="Try a different search or filter." />
      )}

      {jobsQuery.data && jobsQuery.data.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          {jobsQuery.data.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </main>
  );
}
