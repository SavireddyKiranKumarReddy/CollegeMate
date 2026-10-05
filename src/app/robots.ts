export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/super", "/college", "/faculty", "/api/"] }],
    sitemap: "https://collegemate.app/sitemap.xml",
  };
}
