"use client";

import { useParams } from "next/navigation";
import { useApi } from "@/lib/useApi";
import ServiceForm, { type ServiceDoc } from "./ServiceForm";
import { ErrorNote, Loading } from "./ui";

export default function ServiceEditor() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data, error, loading } = useApi<ServiceDoc>(slug ? `/api/admin/services/${encodeURIComponent(slug)}` : null);

  if (error) return <ErrorNote error={error} />;
  if (loading || !data) return <Loading />;
  return <ServiceForm key={data.slug} initial={data} />;
}
