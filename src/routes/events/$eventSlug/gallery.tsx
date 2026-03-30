import { createFileRoute } from "@tanstack/react-router";
import { EventGallery } from "@/components/pages/EventGallery";

export const Route = createFileRoute("/events/$eventSlug/gallery")({
  component: EventGallery,
});
