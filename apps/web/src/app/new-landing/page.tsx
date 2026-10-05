import { LandingPage } from "@/components/landing/landing-page";
import { publicMetadata } from "@/lib/public-seo";

export const metadata = {
  ...publicMetadata("/"),
  title: "DoryAI — new landing review",
  robots: { index: false, follow: false },
};

export default function NewLanding() {
  return <LandingPage />;
}
