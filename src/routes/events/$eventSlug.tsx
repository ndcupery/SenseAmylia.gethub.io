import { createFileRoute } from "@tanstack/react-router";
import { EventDetail } from "@/components/pages/EventDetail";

export const Route = createFileRoute("/events/$eventSlug")({
  component: EventDetail,
});
