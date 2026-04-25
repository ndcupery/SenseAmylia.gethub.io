import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import fs from "fs";

const SITE_URL = "https://phazerlabs.com";

function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    closeBundle() {
      const staticRoutes = [
        { path: "/", priority: "1.0", changefreq: "weekly" },
        { path: "/about", priority: "0.8", changefreq: "monthly" },
        { path: "/gallery", priority: "0.8", changefreq: "weekly" },
        { path: "/contact", priority: "0.9", changefreq: "monthly" },
      ];

      // Extract project slugs from content directories
      const projectDirs = fs.readdirSync(
        path.resolve(__dirname, "src/content/projects"),
        { withFileTypes: true },
      );
      const projectRoutes = projectDirs
        .filter(
          (d) =>
            d.isDirectory() &&
            fs.existsSync(
              path.resolve(
                __dirname,
                "src/content/projects",
                d.name,
                "OVERVIEW.md",
              ),
            ),
        )
        .map((d) => ({
          path: `/laboratory/${d.name}`,
          priority: "0.7",
          changefreq: "monthly",
        }));

      const routes = [...staticRoutes, ...projectRoutes];
      const today = new Date().toISOString().split("T")[0];

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...routes.map(
          (r) =>
            `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
        ),
        "</urlset>",
        "",
      ].join("\n");

      const outDir = path.resolve(__dirname, "dist");
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
      console.log(`\x1b[32m✓ sitemap.xml generated with ${routes.length} URLs\x1b[0m`);
    },
  };
}

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), tailwindcss(), sitemapPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/SenseAmylia.gethub.io/",
});
