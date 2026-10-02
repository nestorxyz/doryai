import { v } from 'convex/values';
import { query, mutation, type MutationCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { getUserId } from './users';
import { categoryNameKey, validateCategoryInput } from './lib/categoryInput';

const getOrCreateCategory = async (
  ctx: MutationCtx,
  userId: Id<'users'>,
  name: string,
  description?: string,
) => {
  const input = validateCategoryInput(name, description);
  const categories = await ctx.db.query('categories')
    .withIndex('by_user', (q) => q.eq('userId', userId)).collect();
  const existing = categories.find((category) =>
    categoryNameKey(category.name) === categoryNameKey(input.name),
  );
  if (existing) return { id: existing._id, name: existing.name, description: existing.description, duplicate: true };

  // The indexed read and insert share one Convex transaction, so retries and
  // concurrent requests for this user's equivalent name cannot create copies.
  const id = await ctx.db.insert('categories', {
    ...input, userId, createdAt: Date.now(), updatedAt: Date.now(),
  });
  return { id, ...input, duplicate: false };
};

export const createForBackend = mutation({
  args: {
    userId: v.id('users'),
    sessionId: v.id('chatSessions'),
    name: v.string(),
    description: v.optional(v.string()),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    if (!process.env.CONVEX_BACKEND_SECRET || args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid secret');
    }
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== args.userId || !await ctx.db.get(args.userId)) {
      throw new Error('Unauthorized or invalid session');
    }
    const data = await getOrCreateCategory(ctx, args.userId, args.name, args.description);
    return { success: true, data };
  },
});

export const getByUser = query({
  args: {
    userId: v.id('users'),
    secret: v.string(), // Require secret
  },
  handler: async (ctx, args) => {
    // Security check: Verify backend secret
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid Secret');
    }

    // Backend usage: allow fetching by userId directly
    const categories = await ctx.db
      .query('categories')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
    return categories;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const categories = await ctx.db
      .query('categories')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const categoriesWithDetails = await Promise.all(
      categories.map(async (category) => {
        const subCategories = await ctx.db
          .query('subCategories')
          .withIndex('by_category', (q) => q.eq('categoryId', category._id))
          .collect();

        const subCategoriesWithLinks = await Promise.all(
          subCategories.map(async (sub) => {
            const links = await ctx.db
              .query('links')
              .withIndex('by_subCategory', (q) =>
                q.eq('subCategoryId', sub._id),
              )
              .collect();

            const linksWithTags = await Promise.all(
              links.map(async (link) => {
                const linkForClient = { ...link };
                delete linkForClient.searchText;
                const linkTags = await ctx.db
                  .query('linkTags')
                  .withIndex('by_link', (q) => q.eq('linkId', link._id))
                  .collect();

                const tags = await Promise.all(
                  linkTags.map(async (lt) => {
                    const tag = await ctx.db.get(lt.tagId);
                    return tag ? { ...tag, id: tag._id } : null;
                  }),
                );

                return {
                  ...linkForClient,
                  id: link._id,
                  tags: tags.filter((t) => t !== null),
                };
              }),
            );

            return {
              ...sub,
              id: sub._id,
              links: linksWithTags,
            };
          }),
        );

        return {
          ...category,
          id: category._id,
          subCategories: subCategoriesWithLinks,
        };
      }),
    );

    return categoriesWithDetails;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const category = await getOrCreateCategory(ctx, userId, args.name, args.description);
    return category.id;
  },
});

export const update = mutation({
  args: {
    id: v.id('categories'),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const category = await ctx.db.get(args.id);
    if (!category || category.userId !== userId)
      throw new Error('Unauthorized');

    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id('categories') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const category = await ctx.db.get(args.id);
    if (!category || category.userId !== userId)
      throw new Error('Unauthorized');

    const subCategories = await ctx.db
      .query('subCategories')
      .withIndex('by_category', (q) => q.eq('categoryId', args.id))
      .collect();

    for (const sub of subCategories) {
      // Cascade delete links and subcategories
      const links = await ctx.db
        .query('links')
        .withIndex('by_subCategory', (q) => q.eq('subCategoryId', sub._id))
        .collect();

      for (const link of links) {
        const linkTags = await ctx.db
          .query('linkTags')
          .withIndex('by_link', (q) => q.eq('linkId', link._id))
          .collect();
        await Promise.all(linkTags.map((lt) => ctx.db.delete(lt._id)));
        await ctx.db.delete(link._id);
      }
      await ctx.db.delete(sub._id);
    }

    await ctx.db.delete(args.id);
  },
});
