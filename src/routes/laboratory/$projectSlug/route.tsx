import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/laboratory/$projectSlug")({
  component: () => <Outlet />,
});
