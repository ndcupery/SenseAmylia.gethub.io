import { createFileRoute } from "@tanstack/react-router";
import { Laboratory } from "@/components/pages/Gallery";

export const Route = createFileRoute("/laboratory/")({
  component: Laboratory,
});
