import type { Metadata } from "next";
import Link from "next/link";
import DemoClient from "./demo-client";

export const metadata: Metadata = {
  title: "CollegeMate Live Demo — MITS-Madanapalle",
  description:
    "Explore CollegeMate on a live college workspace: departments, example questions, cited answers and sources.",
  alternates: { canonical: "/demo/mits-madanapalle" },
  openGraph: {
    title: "CollegeMate Live Demo — MITS-Madanapalle",
    description: "College overview, departments, example questions and cited answers.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "CollegeMate Live Demo — MITS-Madanapalle",
  description: "Interactive demo of the CollegeMate college knowledge platform.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://collegemate.app/" },
      { "@type": "ListItem", position: 2, name: "Live Demo", item: "https://collegemate.app/demo/mits-madanapalle" },
    ],
  },
};

export default function DemoPage() {
  return (
    <div className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow">Live college demo</p>
      <h1 className="h2 mt-2 max-w-2xl">CollegeMate Live Demo — MITS-Madanapalle</h1>
      <p className="lead mt-3 max-w-3xl">
        A working example of a CollegeMate college workspace: college overview, departments,
        knowledge sources, example questions and cited answers. Your college would get its own
        isolated workspace like this one.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/register" className="btn-primary btn-sm">Register your college</Link>
        <Link href="/chat" className="btn-ghost btn-sm">Open chat →</Link>
      </div>
      <DemoClient />
    </div>
  );
}
