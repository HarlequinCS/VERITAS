"use client";

import { useEffect, useRef } from "react";
import type { GlobeInstance } from "globe.gl";

const EARTH_TEXTURE =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const EARTH_BUMP =
  "https://unpkg.com/three-globe/example/img/earth-topology.png";

type ThreatPoint = {
  lat: number;
  lng: number;
  label: string;
  cve?: string;
  vulnerability?: string;
  product?: string;
  severity: "critical" | "high" | "medium" | "monitored";
};

type ThreatMapPayload = {
  points: ThreatPoint[];
  routes: number[][];
};

const THREAT_POINTS: ThreatPoint[] = [
  { lat: 55.7558, lng: 37.6173, label: "Moscow · C2 beacon", severity: "critical" },
  { lat: 39.9042, lng: 116.4074, label: "Beijing · exploit probe", severity: "high" },
  { lat: 35.6892, lng: 51.389, label: "Tehran · credential spray", severity: "critical" },
  { lat: -23.5505, lng: -46.6333, label: "Sao Paulo · botnet node", severity: "medium" },
  { lat: 44.4268, lng: 26.1025, label: "Bucharest · malware relay", severity: "high" },
  { lat: 40.7128, lng: -74.006, label: "New York · protected assets", severity: "monitored" },
  { lat: 51.5074, lng: -0.1278, label: "London · protected assets", severity: "monitored" },
  { lat: 1.3521, lng: 103.8198, label: "Singapore · protected assets", severity: "monitored" },
];

const ROUTES: number[][] = [
  [0, 5],
  [0, 6],
  [1, 7],
  [2, 6],
  [3, 5],
  [4, 6],
  [1, 5],
  [2, 7],
] ;

function severityColor(severity: ThreatPoint["severity"]) {
  if (severity === "critical") return "rgba(244,63,94,0.95)";
  if (severity === "high") return "rgba(249,115,22,0.9)";
  if (severity === "medium") return "rgba(245,158,11,0.85)";
  return "rgba(0,136,255,0.85)";
}

async function loadThreatMap() {
  try {
    const response = await fetch("/api/threat-map", {
      cache: "force-cache",
    });

    if (!response.ok) throw new Error("Threat map API failed");

    const payload = (await response.json()) as ThreatMapPayload;
    if (!payload.points?.length || !payload.routes?.length) {
      throw new Error("Threat map API returned no data");
    }

    return payload;
  } catch {
    return {
      points: THREAT_POINTS,
      routes: ROUTES,
    } satisfies ThreatMapPayload;
  }
}

export function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let globeInstance: GlobeInstance | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    let cleanup = false;

    async function init() {
      const Globe = (await import("globe.gl")).default;
      if (cleanup || !containerRef.current) return;

      const el = containerRef.current;
      const globe = new Globe(el, {
        rendererConfig: { alpha: true, antialias: true },
      })
        .globeImageUrl(EARTH_TEXTURE)
        .bumpImageUrl(EARTH_BUMP)
        .backgroundColor("rgba(0,0,0,0)")
        .showGraticules(false)
        .showAtmosphere(true)
        .atmosphereColor("#0088FF")
        .atmosphereAltitude(0.18)
        .pointOfView({ lat: 18, lng: 20, altitude: 1.85 });

      globeInstance = globe;

      const syncSize = () => {
        const { width, height } = el.getBoundingClientRect();
        globe.width(width).height(height);
      };

      syncSize();
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(el);

      const threatMap = await loadThreatMap();
      if (cleanup) return;

      const arcsData = threatMap.routes.map(([from, to]) => {
        const source = threatMap.points[from];
        const target = threatMap.points[to];
        return {
          startLat: source.lat,
          startLng: source.lng,
          endLat: target.lat,
          endLng: target.lng,
          color: [severityColor(source.severity), "rgba(0,204,255,0.75)"],
        };
      });

      globe
        .arcsData(arcsData)
        .arcColor("color")
        .arcDashLength(0.55)
        .arcDashGap(1.6)
        .arcDashInitialGap(() => Math.random())
        .arcDashAnimateTime(() => 1600 + Math.random() * 1200)
        .arcStroke(0.95);

      const ringData = threatMap.points.filter((p) => p.severity !== "monitored");

      globe
        .pointsData(threatMap.points)
        .pointLat("lat")
        .pointLng("lng")
        .pointLabel("label")
        .pointAltitude(0.025)
        .pointRadius((point: object) => {
          const p = point as ThreatPoint;
          return p.severity === "critical" ? 0.72 : p.severity === "monitored" ? 0.42 : 0.56;
        })
        .pointColor((point: object) => severityColor((point as ThreatPoint).severity))
        .ringsData(ringData)
        .ringLat("lat")
        .ringLng("lng")
        .ringColor((point: object) => (t: number) => {
          const color = severityColor((point as ThreatPoint).severity);
          return color.replace(/0\.\d+\)$/, `${0.55 * (1 - t)})`);
        })
        .ringMaxRadius((point: object) =>
          (point as ThreatPoint).severity === "critical" ? 8 : 5.5,
        )
        .ringPropagationSpeed((point: object) =>
          (point as ThreatPoint).severity === "critical" ? 2.4 : 1.6,
        )
        .ringRepeatPeriod((point: object) =>
          (point as ThreatPoint).severity === "critical" ? 900 : 1400,
        );

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.45;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableRotate = true;

      const scheduleAutoRotate = () => {
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          if (globeInstance) globeInstance.controls().autoRotate = true;
        }, 2500);
      };

      controls.addEventListener("start", () => {
        if (resumeTimer) clearTimeout(resumeTimer);
        controls.autoRotate = false;
      });
      controls.addEventListener("end", scheduleAutoRotate);
    }

    init();

    return () => {
      cleanup = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      resizeObserver?.disconnect();
      if (globeInstance) {
        globeInstance._destructor();
        globeInstance = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      aria-hidden
    />
  );
}
