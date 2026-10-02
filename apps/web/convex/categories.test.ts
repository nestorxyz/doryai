import { afterEach, describe, expect, it, vi } from 'vitest';
import { createForBackend } from './categories';
import { categoryNameKey, validateCategoryInput } from './lib/categoryInput';

type Row = { _id: string; userId: string; name: string; description?: string };
const setup = (rows: Row[] = [], sessionOwner = 'user-a') => {
  let indexedUser = '';
  const db = {
    get: vi.fn(async (id: string) => id === 'session-a'
      ? { userId: sessionOwner }
      : id === 'user-a' ? { _id: id } : null),
    query: vi.fn(() => ({
      withIndex: (_index: string, select: (query: unknown) => unknown) => {
        select({ eq: (_field: string, value: string) => { indexedUser = value; } });
        return { collect: async () => rows.filter((row) => row.userId === indexedUser) };
      },
    })),
    insert: vi.fn(async (_table: string, value: Omit<Row, '_id'>) => {
      const id = `category-${rows.length}`;
      rows.push({ _id: id, ...value });
      return id;
    }),
  };
  const handler = (createForBackend as unknown as {
    _handler: (ctx: { db: typeof db }, args: Record<string, unknown>) => Promise<{
      success: boolean; data: { id: string; name: string; duplicate: boolean; description?: string };
    }>;
  })._handler;
  const run = (args: Record<string, unknown> = {}) => handler({ db }, {
    userId: 'user-a', sessionId: 'session-a', name: 'Kubo', secret: 'test-secret', ...args,
  });
  return { db, rows, run };
};

afterEach(() => vi.unstubAllEnvs());

describe('user-scoped category creation', () => {
  it('persists the name and description under the authenticated caller', async () => {
    vi.stubEnv('CONVEX_BACKEND_SECRET', 'test-secret');
    const { run, rows } = setup();
    expect(await run({ name: ' Kubo ', description: ' AI accounting ' })).toEqual({
      success: true, data: { id: 'category-0', name: 'Kubo', description: 'AI accounting', duplicate: false },
    });
    expect(rows[0]).toMatchObject({ userId: 'user-a', name: 'Kubo', description: 'AI accounting' });
  });

  it('reuses case/spacing-equivalent names without changing existing data', async () => {
    vi.stubEnv('CONVEX_BACKEND_SECRET', 'test-secret');
    const { run, db, rows } = setup([{ _id: 'existing', userId: 'user-a', name: 'Side Projects', description: 'Original' }]);
    expect((await run({ name: ' side   projects ', description: 'Replacement' })).data).toEqual({
      id: 'existing', name: 'Side Projects', description: 'Original', duplicate: true,
    });
    expect(db.insert).not.toHaveBeenCalled();
    expect(rows).toHaveLength(1);
  });

  it('is retry-safe and never reuses another user\'s category', async () => {
    vi.stubEnv('CONVEX_BACKEND_SECRET', 'test-secret');
    const { run, db, rows } = setup([{ _id: 'other', userId: 'user-b', name: 'Kubo' }]);
    const first = await run();
    const second = await run({ name: 'kubo' });
    expect(second.data).toMatchObject({ id: first.data.id, duplicate: true });
    expect(db.insert).toHaveBeenCalledTimes(1);
    expect(rows).toHaveLength(2);
  });

  it('rejects wrong/missing backend secrets and foreign/missing sessions before writing', async () => {
    vi.stubEnv('CONVEX_BACKEND_SECRET', 'test-secret');
    const own = setup();
    await expect(own.run({ secret: 'wrong' })).rejects.toThrow('Unauthorized');
    await expect(own.run({ sessionId: 'missing' })).rejects.toThrow('Unauthorized');
    const foreign = setup([], 'user-b');
    await expect(foreign.run()).rejects.toThrow('Unauthorized');
    vi.stubEnv('CONVEX_BACKEND_SECRET', '');
    await expect(own.run({ secret: '' })).rejects.toThrow('Unauthorized');
    expect(own.db.insert).not.toHaveBeenCalled();
    expect(foreign.db.insert).not.toHaveBeenCalled();
  });

  it('rejects invalid input without inserting', async () => {
    vi.stubEnv('CONVEX_BACKEND_SECRET', 'test-secret');
    const { run, db } = setup();
    for (const args of [{ name: ' ' }, { name: 'x'.repeat(81) }, { name: 'Kubo\n' }, { description: 'x'.repeat(501) }]) {
      await expect(run(args)).rejects.toThrow();
    }
    expect(db.insert).not.toHaveBeenCalled();
  });
});

it('normalizes names consistently while preserving accents and display case', () => {
  expect(categoryNameKey(' Ｋubo ')).toBe(categoryNameKey('kubo'));
  expect(validateCategoryInput(' Economía ', '   ')).toEqual({ name: 'Economía', description: undefined });
});
