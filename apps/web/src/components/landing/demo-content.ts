export type DemoLink = {
  id: string;
  title: string;
  platform: "Instagram" | "YouTube" | "TikTok";
  format: "Instagram Reel" | "YouTube Short" | "TikTok";
  capture: string;
  category: string;
  artwork: "recipe" | "hook" | "framing";
  coverTitle: string;
  question: string;
  answer: string;
};

// Fictional clips with prepared answers, not actual creators' posts, an
// extraction result, live search or a private user library. No fake source URLs.
export const demoLinks: readonly DemoLink[] = [
  {
    id: "recipe",
    title: "The one-pan pasta idea",
    platform: "Instagram",
    format: "Instagram Reel",
    capture: "Example · caption only",
    category: "Recipes",
    artwork: "recipe",
    coverTitle: "One pan.\nLess cleanup.",
    question: "Find that Reel with the one-pan pasta.",
    answer:
      "Here’s the one-pan pasta Reel in this example library. The sample saved caption mentions cooking the pasta and sauce together in one pan. Only the caption is available here, so I can’t confirm ingredient quantities or the video’s steps.",
  },
  {
    id: "hook",
    title: "One clear hook, not three",
    platform: "YouTube",
    format: "YouTube Short",
    capture: "Example · transcript excerpt",
    category: "Content ideas",
    artwork: "hook",
    coverTitle: "One idea.\nThen the story.",
    question: "What did that Short say about opening a video?",
    answer:
      "The sample transcript for this Short says to open with one clear idea, then build the story around it. It contrasts a focused opening with introducing three ideas at once. That’s the excerpt included in this example, not a live analysis of a video.",
  },
  {
    id: "framing",
    title: "Two ways to frame a shot",
    platform: "TikTok",
    format: "TikTok",
    capture: "Example · metadata only",
    category: "Video making",
    artwork: "framing",
    coverTitle: "Same scene.\nA new angle.",
    question: "Find the TikTok about framing a shot.",
    answer:
      "This example TikTok is titled “Two ways to frame a shot” and filed under Video making. Only sample metadata is available, not a transcript or the video itself, so I can find the link but can’t describe the techniques it demonstrates.",
  },
];

export const demoDisclosure =
  "Fictional clips, illustrated covers and prepared answers—not real posts or playable videos. No live AI, account or saving in this demo.";

export function findDemoLink(id: string | null): DemoLink | undefined {
  return demoLinks.find((link) => link.id === id);
}
