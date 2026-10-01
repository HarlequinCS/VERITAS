const SITE = "https://scanwithveritas.tech";

export function publicOrigin(request: Request) {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL ?? SITE).replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (!host || /^(0\.0\.0\.0|127\.0\.0\.1|localhost)(:\d+)?$/.test(host)) {
    return configured;
  }
  return `${proto}://${host}`;
}
