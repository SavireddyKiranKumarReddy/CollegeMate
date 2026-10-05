import type { Metadata } from "next";

const SITE = "https://collegemate.app";

export default function sitemap() {
  return [
    { url: `${SITE}/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE}/demo/mits-madanapalle`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE}/register`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE}/auth`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];
}

export const metadata: Metadata = {};
