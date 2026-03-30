import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/events/$eventSlug")({
  component: () => <Outlet />,
});
