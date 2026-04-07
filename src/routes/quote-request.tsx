import { createFileRoute } from "@tanstack/react-router";
import { QuoteRequest } from "@/components/pages/QuoteRequest";


export const Route = createFileRoute("/quote-request")({
  component: QuoteRequest,
});
