import { JobDetail } from "@/components/jobs/job-detail";

export default async function JobDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
      <JobDetail id={id} />
    </main>
  );
}
