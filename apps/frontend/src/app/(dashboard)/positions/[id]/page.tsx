import { PositionDetailPage } from "@/components/positions/position-detail-page";

export default async function PositionDetailRoutePage(
  props: {
    params: Promise<{ id: string }>;
  },
) {
  const { id } = await props.params;

  return <PositionDetailPage id={id} />;
}
