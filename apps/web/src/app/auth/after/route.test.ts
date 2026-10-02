import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@clerk/nextjs/server', () => ({ currentUser: vi.fn() }));
vi.mock('../../../server/billing/polar', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../server/billing/polar')>();
  return { ...original, createPolarCheckoutUrl: vi.fn() };
});

import { currentUser } from '@clerk/nextjs/server';
import { createPolarCheckoutUrl } from '../../../server/billing/polar';
import { GET } from './route';

describe('checkout entry', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(currentUser).mockResolvedValue({
      id: 'user_test',
      fullName: 'Test Person',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    } as Awaited<ReturnType<typeof currentUser>>);
  });

  it('keeps annual checkout intent through the sign-in gate', async () => {
    vi.mocked(currentUser).mockResolvedValue(null);
    const response = await GET(new Request('https://app.example.com/auth/after?plan=annual&intent=checkout'));
    const destination = new URL(response.headers.get('location')!);
    expect(destination.pathname).toBe('/sign-in');
    expect(destination.searchParams.get('redirect_url')).toBe('/auth/after?plan=annual&intent=checkout');
    expect(createPolarCheckoutUrl).not.toHaveBeenCalled();
  });

  it.each(['monthly', 'annual'])('opens the configured %s checkout for the authenticated user', async (plan) => {
    vi.mocked(createPolarCheckoutUrl).mockResolvedValue('https://polar.sh/checkout/test');
    const response = await GET(new Request(`https://app.example.com/auth/after?plan=${plan}&intent=checkout`));
    expect(response.headers.get('location')).toBe('https://polar.sh/checkout/test');
    expect(createPolarCheckoutUrl).toHaveBeenCalledWith({
      plan, clerkUserId: 'user_test', email: 'test@example.com', name: 'Test Person', origin: 'https://app.example.com',
    });
  });

  it.each(['free', 'https://other.example.com'])('does not create checkout for invalid plan %s', async (plan) => {
    const response = await GET(new Request(`https://app.example.com/auth/after?plan=${encodeURIComponent(plan)}&intent=checkout`));
    expect(response.headers.get('location')).toBe('https://app.example.com/dashboard');
    expect(createPolarCheckoutUrl).not.toHaveBeenCalled();
  });

  it('returns to a safe recovery page instead of JSON or provider details', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      vi.mocked(createPolarCheckoutUrl).mockRejectedValue(new Error('private provider response'));
      const response = await GET(new Request('https://app.example.com/auth/after?plan=annual&intent=checkout'));
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('https://app.example.com/billing/unavailable?plan=annual');
      expect(await response.text()).not.toContain('private provider response');
      expect(JSON.stringify(log.mock.calls)).not.toContain('private provider response');
      expect(createPolarCheckoutUrl).toHaveBeenCalledTimes(1);
    } finally {
      log.mockRestore();
    }
  });
});
