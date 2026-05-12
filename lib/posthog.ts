import "server-only";
import { PostHog } from "posthog-node";

export async function captureServerEvent(payload: {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
}): Promise<void> {
  const key = process.env.POSTHOG_SERVER_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";
  if (!key) return;
  const client = new PostHog(key, { host, flushAt: 1, flushInterval: 0 });
  client.capture({
    distinctId: payload.distinctId,
    event: payload.event,
    properties: payload.properties,
  });
  await client.shutdown();
}
