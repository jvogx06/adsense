import { siteConfig } from "@/config/site";

/**
 * /ads.txt (spec §18.3). We never invent a line. When a real AdSense publisher
 * id is configured, we emit exactly the AdSense line for that publisher;
 * otherwise we serve a documented placeholder (still 200 text/plain) so the
 * route exists and can be tested.
 */
export const dynamic = "force-static";

export function GET() {
  const client = siteConfig.adsenseClient; // e.g. ca-pub-XXXXXXXXXXXXXXXX
  let body: string;

  if (client && /^ca-pub-\d{16}$/.test(client)) {
    const pub = client.replace(/^ca-/, ""); // pub-XXXXXXXXXXXXXXXX
    body = `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`;
  } else {
    body =
      "# ads.txt\n" +
      "# No advertising publisher is configured yet.\n" +
      "# Once a publisher is set up, its authorised google.com DIRECT line appears here.\n";
  }

  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
