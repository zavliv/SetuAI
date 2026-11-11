import { notFound } from "next/navigation";
import ServiceDetail from "@/components/ServiceDetail";
import { getService, services } from "@/lib/data";

export function generateStaticParams() {
  return services.map((s) => ({ id: s.id }));
}

export default async function ServicePage({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;
  const service = getService(id);
  if (!service) notFound();
  return <ServiceDetail key={service.id} service={service} />;
}
