import "server-only";

export async function fetchLinkedInProfile(linkedinUrl: string): Promise<unknown> {
  const apiKey = process.env.PROXYCURL_API_KEY;
  if (!apiKey) throw new Error("PROXYCURL_API_KEY не задан");

  const url = new URL("https://nubela.co/proxycurl/api/v2/linkedin");
  url.searchParams.set("url", linkedinUrl);
  url.searchParams.set("skills", "include");
  url.searchParams.set("use_cache", "if-present");
  url.searchParams.set("fallback_to_cache", "on");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Proxycurl ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<unknown>;
}
