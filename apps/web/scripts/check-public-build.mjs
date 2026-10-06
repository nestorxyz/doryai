import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Check generated HTML, not React source, without bypassing app authentication.
const paths = [
  "/",
  "/how-it-works",
  "/about",
  "/privacy",
  "/security",
  "/terms",
];
const titles = new Set();
const descriptions = new Set();
const linkedPaths = new Set();
let origin;

for (const path of paths) {
  const file = path === "/" ? "index" : path.slice(1);
  const html = await readFile(`.next/server/app/${file}.html`, "utf8");
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${path}: one H1`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(
    /<meta name="description" content="([^"]+)"/s,
  )?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/s)?.[1];
  assert.ok(
    title && description && canonical,
    `${path}: metadata in initial HTML`,
  );
  assert.ok(!titles.has(title), `${path}: unique title`);
  assert.ok(!descriptions.has(description), `${path}: unique description`);
  titles.add(title);
  descriptions.add(description);
  origin ??= new URL(canonical).origin;
  assert.equal(
    new URL(canonical).href,
    new URL(path, origin).href,
    `${path}: canonical`,
  );
  assert.match(
    html,
    /<meta name="robots" content="[^"]+"/,
    `${path}: explicit indexing policy`,
  );

  for (const [, attributes] of html.matchAll(/<img\s([^>]+)>/g)) {
    assert.match(attributes, /\balt="[^"]*"/, `${path}: image alt attribute`);
    // Fill images reserve space through their parent, checked in browser QA.
    if (!attributes.includes('data-nimg="fill"')) {
      assert.match(
        attributes,
        /\bwidth="\d+"/,
        `${path}: reserved image width`,
      );
      assert.match(
        attributes,
        /\bheight="\d+"/,
        `${path}: reserved image height`,
      );
    }
  }
  for (const [, href] of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    if (href.startsWith("/")) linkedPaths.add(new URL(href, origin).pathname);
  }
  const schemas = [
    ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
  ].map(([, json]) => JSON.parse(json));
  if (path === "/") {
    for (const text of [
      "Save the video.",
      "Your example video library",
      "Instagram Reels",
      "YouTube Shorts",
      "TikTok",
      "Fictional clips",
      "not real posts or playable videos",
    ]) {
      assert.ok(html.includes(text), `Homepage landing SSR: ${text}`);
    }
    assert.equal(
      schemas.filter((schema) => schema["@graph"]).length,
      1,
      "Homepage has one product schema graph",
    );
  }
  if (path === "/" || path === "/how-it-works") {
    const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
    assert.ok(faq, "Visible FAQ has structured data");
    assert.equal(
      faq.mainEntity.length,
      (html.match(/<details(?:\s|>)/g) ?? []).length,
    );
    for (const question of faq.mainEntity) {
      const safeText = question.name
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      assert.ok(html.includes(safeText), `FAQ visible: ${question.name}`);
    }
  }
  if (path !== "/") {
    assert.ok(
      schemas.some((schema) => schema["@type"] === "BreadcrumbList"),
      `${path}: breadcrumbs`,
    );
  }
  console.log(
    `${path}: SSR content, H1, metadata, canonical, images and JSON-LD passed`,
  );
}
for (const path of paths)
  assert.ok(linkedPaths.has(path), `${path}: not orphaned`);
console.log("All six public pages have internal links.");

for (const stem of [
  "product",
  "isologo-black",
  "landing/personal-inspo",
  "landing/tutorials",
  "landing/research",
]) {
  const image = await readFile(`public/${stem}.webp`);
  assert.equal(
    image.toString("ascii", 0, 4),
    "RIFF",
    `${stem}: WebP container`,
  );
  assert.equal(
    image.toString("ascii", 8, 12),
    "WEBP",
    `${stem}: WebP signature`,
  );
}
console.log("All five public WebP assets have valid format signatures.");

// The isolated design-review route is rendered, but not an indexable duplicate
// of the homepage. Keep its content usable before hydration as well.
const landing = await readFile(".next/server/app/new-landing.html", "utf8");
assert.equal(
  (landing.match(/<h1(?:\s|>)/g) ?? []).length,
  1,
  "New landing: one H1",
);
assert.match(
  landing,
  /<meta name="robots" content="noindex, nofollow"/,
  "Review route noindex",
);
const landingCanonical = landing.match(
  /<link rel="canonical" href="([^"]+)"/s,
)?.[1];
assert.equal(
  new URL(landingCanonical).href,
  new URL("/", origin).href,
  "Review canonical remains the homepage",
);
for (const text of [
  "Save the video.",
  "Your example video library",
  "No live AI",
  "Reset demo",
  "Instagram Reels",
  "YouTube Shorts",
  "TikTok",
  "The one-pan pasta idea",
  "One clear hook, not three",
  "Two ways to frame a shot",
  "Fictional clips",
  "not real posts or playable videos",
]) {
  assert.ok(landing.includes(text), `New landing SSR: ${text}`);
}
const landingSchemas = [
  ...landing.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
].map(([, json]) => JSON.parse(json));
const landingFaq = landingSchemas.find(
  (schema) => schema["@type"] === "FAQPage",
);
assert.ok(landingFaq, "New landing FAQ schema");
assert.equal(
  landingFaq.mainEntity.length,
  (landing.match(/<details(?:\s|>)/g) ?? []).length,
  "New landing FAQ parity",
);
for (const item of landingFaq.mainEntity) {
  assert.ok(
    landing.includes(
      item.name
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;"),
    ),
    "New landing visible FAQ",
  );
}
for (const path of [
  "/sign-in",
  "/privacy",
  "/security",
  "/terms",
  "/about",
  "/how-it-works",
]) {
  assert.ok(
    landing.includes(`href="${path}"`),
    `New landing: valid internal ${path}`,
  );
}
for (const [, attributes] of landing.matchAll(/<img\s([^>]+)>/g)) {
  assert.match(attributes, /\balt="[^"]+"/);
  assert.match(attributes, /\bwidth="\d+"/);
  assert.match(attributes, /\bheight="\d+"/);
}
console.log(
  "/new-landing: SSR demo, noindex, canonical, FAQ, images and links passed.",
);
