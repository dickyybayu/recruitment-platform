import { ApplicantDetailPage } from "@/components/applicants/applicant-detail-page";

export default async function ApplicantDetailRoutePage(
  props: {
    params: Promise<{ id: string }>;
  },
) {
  const { id } = await props.params;

  return <ApplicantDetailPage id={id} />;
}
