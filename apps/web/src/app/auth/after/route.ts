import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createPolarCheckoutUrl, isBillingPlan } from '../../../server/billing/polar';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const plan = searchParams.get('plan');
  const intent = searchParams.get('intent');

  const user = await currentUser();

  if (!user) {
    const afterUrl = `/auth/after?plan=${plan}&intent=${intent}`;
    const signInUrl = new URL(`${origin}/sign-in`);
    signInUrl.searchParams.set('redirect_url', afterUrl);
    return NextResponse.redirect(signInUrl.toString());
  }

  if (intent !== 'checkout' || !isBillingPlan(plan)) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  const email = user.primaryEmailAddress?.emailAddress;
  try {
    const dest = await createPolarCheckoutUrl({
      plan,
      clerkUserId: user.id,
      email,
      name: user.fullName,
      origin,
    });
    return NextResponse.redirect(dest);
  } catch (error) {
    console.error('Unable to create Polar checkout', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
    const unavailableUrl = new URL('/billing/unavailable', origin);
    unavailableUrl.searchParams.set('plan', plan);
    return NextResponse.redirect(unavailableUrl);
  }
}
