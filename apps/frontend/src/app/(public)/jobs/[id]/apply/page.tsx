import { ApplyForm } from "@/components/jobs/apply-form";

export default async function ApplyPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
      <ApplyForm positionId={id} />
    </main>
  );
}
