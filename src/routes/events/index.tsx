import { createFileRoute } from "@tanstack/react-router";
import { EventsPage } from "@/components/pages/Events";

export const Route = createFileRoute("/events/")({
  component: EventsPage,
});
