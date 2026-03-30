import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetail } from "@/components/pages/ProjectDetail";

export const Route = createFileRoute("/laboratory/$projectSlug/")({
  component: ProjectDetail,
});
