export const categoryNameKey = (name: string): string =>
  name.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();

export const validateCategoryInput = (name: string, description?: string) => {
  const normalizedName = name.normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (!normalizedName || normalizedName.length > 80 || /[\p{Cc}\p{Cf}]/u.test(name)) {
    throw new Error('Category name must contain 1–80 characters without control characters.');
  }
  if (description !== undefined && description.length > 500) {
    throw new Error('Category description must contain at most 500 characters.');
  }
  return { name: normalizedName, description: description?.trim() || undefined };
};
