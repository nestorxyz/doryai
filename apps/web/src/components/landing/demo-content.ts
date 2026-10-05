export type DemoLink = {
  id: string;
  title: string;
  author: string;
  domain: string;
  url: string;
  category: string;
  artwork: "schedule" | "components" | "grid";
  question: string;
  answer: string;
};

// Curated, public-source summaries. This is an illustrative demo, not a user
// library, extraction result, live search or generated AI response.
export const demoLinks: readonly DemoLink[] = [
  {
    id: "schedule",
    title: "Maker’s Schedule, Manager’s Schedule",
    author: "Paul Graham",
    domain: "paulgraham.com",
    url: "https://paulgraham.com/makersschedule.html",
    category: "Work & focus",
    artwork: "schedule",
    question: "Find that essay about meetings and deep work.",
    answer:
      "That’s Paul Graham’s essay on maker and manager schedules. Managers divide the day into short appointments; makers need long, uninterrupted blocks. A meeting can fragment those blocks and make creative work harder.",
  },
  {
    id: "components",
    title: "Thinking in React",
    author: "React documentation",
    domain: "react.dev",
    url: "https://react.dev/learn/thinking-in-react",
    category: "Building things",
    artwork: "components",
    question: "What was that guide to breaking a UI into components?",
    answer:
      "You’re thinking of “Thinking in React.” It starts with a component hierarchy, builds a static version, then identifies the minimal state, decides where that state belongs, and connects the data flow.",
  },
  {
    id: "grid",
    title: "CSS grid layout",
    author: "MDN Web Docs",
    domain: "developer.mozilla.org",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout",
    category: "Building things",
    artwork: "grid",
    question: "Find the layout reference with rows and columns.",
    answer:
      "That’s MDN’s CSS grid layout guide. Grid is a two-dimensional layout system: it arranges content in rows and columns, with controls for track sizing, placement and alignment.",
  },
];

export const demoDisclosure =
  "Illustrated cards and prepared answers from three public sources. No live AI, account or saving in this demo.";

export function findDemoLink(id: string | null): DemoLink | undefined {
  return demoLinks.find((link) => link.id === id);
}
