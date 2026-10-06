import { LandingPage } from '@/components/landing/landing-page';
import { publicMetadata } from '@/lib/public-seo';

export const metadata = publicMetadata('/');

export default function Home() {
  return <LandingPage />;
}
