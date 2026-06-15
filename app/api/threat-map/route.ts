import { NextResponse } from "next/server";

export const revalidate = 3600;

type CisaKevItem = {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  knownRansomwareCampaignUse: string;
};

type CisaKevFeed = {
  vulnerabilities: CisaKevItem[];
};

const CISA_KEV_URL =
  "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

const REGIONS = [
  { lat: 55.7558, lng: 37.6173, city: "Moscow", signal: "C2 beacon" },
  { lat: 39.9042, lng: 116.4074, city: "Beijing", signal: "exploit probe" },
  { lat: 35.6892, lng: 51.389, city: "Tehran", signal: "credential spray" },
  { lat: -23.5505, lng: -46.6333, city: "Sao Paulo", signal: "botnet node" },
  { lat: 44.4268, lng: 26.1025, city: "Bucharest", signal: "malware relay" },
] as const;

const PROTECTED_REGIONS = [
  { lat: 40.7128, lng: -74.006, city: "New York" },
  { lat: 51.5074, lng: -0.1278, city: "London" },
  { lat: 1.3521, lng: 103.8198, city: "Singapore" },
] as const;

export async function GET() {
  const response = await fetch(CISA_KEV_URL, {
    next: { revalidate },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to load CISA KEV feed" },
      { status: 502 },
    );
  }

  const feed = (await response.json()) as CisaKevFeed;
  const vulnerabilities = [...feed.vulnerabilities]
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
    )
    .slice(0, 8);

  const points = [
    ...vulnerabilities.slice(0, REGIONS.length).map((vulnerability, index) => {
      const region = REGIONS[index];
      const ransomware =
        vulnerability.knownRansomwareCampaignUse.toLowerCase() === "known";

      return {
        lat: region.lat,
        lng: region.lng,
        city: region.city,
        cve: vulnerability.cveID,
        label: `${region.city} · ${region.signal} · ${vulnerability.cveID}`,
        vulnerability: vulnerability.vulnerabilityName,
        product: `${vulnerability.vendorProject} ${vulnerability.product}`,
        severity: ransomware ? "critical" : index < 3 ? "high" : "medium",
      };
    }),
    ...PROTECTED_REGIONS.map((region) => ({
      lat: region.lat,
      lng: region.lng,
      city: region.city,
      cve: "protected-assets",
      label: `${region.city} · protected asset region`,
      vulnerability: "Protected asset region",
      product: "VERITAS coverage",
      severity: "monitored",
    })),
  ];

  const routes = REGIONS.flatMap((_, index) => [
    [index, REGIONS.length + (index % PROTECTED_REGIONS.length)],
  ]);

  return NextResponse.json({
    source: "CISA Known Exploited Vulnerabilities",
    sourceUrl: CISA_KEV_URL,
    generatedAt: new Date().toISOString(),
    vulnerabilities,
    points,
    routes,
  });
}
