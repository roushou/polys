import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import mermaid from "astro-mermaid";
import starlightThemeRapide from "starlight-theme-rapide";

export default defineConfig({
  site: "https://polys.kenji.sh",
  integrations: [
    starlight({
      title: "Polys",
      description:
        "A TypeScript library for interacting with Polymarket APIs. Build trading bots, analyze markets, and access prediction market data.",
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
      },
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://polys.kenji.sh/og.png",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:type",
            content: "website",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:card",
            content: "summary_large_image",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content: "https://polys.kenji.sh/og.png",
          },
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/roushou/polys",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            { label: "Installation", slug: "guides/installation" },
            { label: "Getting Started", slug: "guides/getting-started" },
            { label: "Error Handling", slug: "guides/error-handling" },
          ],
        },
        {
          label: "Order Attribution",
          items: [
            { label: "Overview", slug: "order-attribution/overview" },
            { label: "Setup", slug: "order-attribution/setup" },
            { label: "Deployment", slug: "order-attribution/deployment" },
            { label: "Client Usage", slug: "order-attribution/client-usage" },
            {
              label: "Troubleshooting",
              slug: "order-attribution/troubleshooting",
            },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "Polymarket", slug: "reference/polymarket" },
            {
              label: "CLOB",
              collapsed: true,
              items: [
                { label: "Overview", slug: "reference/clob/overview" },
                { label: "Markets", slug: "reference/clob/markets" },
                { label: "Order Book", slug: "reference/clob/order-book" },
                { label: "Orders", slug: "reference/clob/orders" },
                { label: "Positions", slug: "reference/clob/positions" },
                { label: "Trades", slug: "reference/clob/trades" },
              ],
            },
            {
              label: "Gamma",
              collapsed: true,
              items: [
                { label: "Overview", slug: "reference/gamma/overview" },
                { label: "Markets", slug: "reference/gamma/markets" },
                { label: "Events", slug: "reference/gamma/events" },
                { label: "Sports", slug: "reference/gamma/sports" },
                { label: "Tags", slug: "reference/gamma/tags" },
              ],
            },
            {
              label: "Data",
              collapsed: true,
              items: [
                { label: "Overview", slug: "reference/data/overview" },
                { label: "Users", slug: "reference/data/users" },
                { label: "Holders", slug: "reference/data/holders" },
                { label: "Builders", slug: "reference/data/builders" },
              ],
            },
          ],
        },
      ],
      plugins: [starlightThemeRapide()],
    }),
    mermaid({
      theme: "forest",
      autoTheme: true,
    }),
  ],
});
