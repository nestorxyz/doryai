import { describe, expect, it } from "vitest";
import { demoDisclosure, demoLinks, findDemoLink } from "./demo-content";
import { publicSitemap } from "../../lib/public-seo";

describe("landing example library", () => {
  it("has distinct questions and sources with stable selection identities", () => {
    expect(demoLinks).toHaveLength(3);
    for (const field of ["id", "question", "url"] as const)
      expect(new Set(demoLinks.map((link) => link[field])).size).toBe(3);
    for (const link of demoLinks) {
      expect(findDemoLink(link.id)).toBe(link);
      const url = new URL(link.url);
      expect(url.protocol).toBe("https:");
      expect(url.hostname).toBe(link.domain);
      expect(link.answer.length).toBeGreaterThan(80);
      expect(link.answer.length).toBeLessThan(400);
    }
  });

  it("reset and unrecognized selections do not return an unrelated source", () => {
    expect(findDemoLink(null)).toBeUndefined();
    expect(findDemoLink("not-a-sample")).toBeUndefined();
  });

  it("discloses prepared examples rather than pretending to save or search", () => {
    expect(demoDisclosure).toContain("prepared answers");
    expect(demoDisclosure).toContain("No live AI");
    expect(demoDisclosure).toContain("No live AI, account or saving");
  });

  it("keeps the review route out of the public discovery index", () => {
    const paths = publicSitemap(new URL("https://www.doryai.xyz"));
    expect(
      paths.some((entry) => new URL(entry.url).pathname === "/new-landing"),
    ).toBe(false);
    expect(paths).toHaveLength(6);
  });
});
