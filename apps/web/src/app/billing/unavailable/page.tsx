import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { isBillingPlan } from '@/server/billing/polar';

export const metadata: Metadata = {
  title: 'Checkout unavailable • DoryAI',
  robots: { index: false, follow: false },
};

export default async function BillingUnavailablePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const { plan } = await searchParams;
  const retryUrl = typeof plan === 'string' && isBillingPlan(plan)
    ? `/auth/after?plan=${plan}&intent=checkout`
    : undefined;

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-6 px-6 py-12">
      <p className="text-sm font-medium text-muted-foreground">DoryAI</p>
      <h1 className="text-3xl font-semibold tracking-tight">We couldn’t open checkout</h1>
      <p className="text-muted-foreground">
        Please try again later. Your library and current plan are unchanged.
        This failed attempt did not complete a payment.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard" className={buttonVariants()}>
          Back to my library
        </Link>
        {retryUrl ? (
          <Link href={retryUrl} prefetch={false} className={buttonVariants({ variant: 'outline' })}>
            Try checkout again
          </Link>
        ) : null}
      </div>
    </main>
  );
}
