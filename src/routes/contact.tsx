import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/pages/Contact";

export const Route = createFileRoute("/contact")({
  component: Contact,
});
