import { findUserUrl } from './user-url';

// Only the latest user's explicit command may enable a category write. Saved
// page text, prior chat history, and ordinary link saves cannot enable it.
const categoryCommandPatterns = [
  /^creemos\s+(?!que\b)/i,
  /^(?:crea|crear|creamos|agrega|anade|create|add)\s+(?:(?:una?|la|a|the|nueva?|new)\s+)*(?:categoria|category)\b/i,
  /^(?:puedes|podemos|quiero|quiero que)\s+(?:crear|crees|agregar|agregues)\s+(?:(?:una?|la|nueva?)\s+)*categoria\b/i,
  /^(?:can you|could you|let'?s)\s+(?:create|add)\s+(?:(?:a|the|new)\s+)*category\b/i,
];

const categoryCommandBody = (message: string): string | undefined => {
  if (findUserUrl(message)) return undefined;
  const text = message.normalize('NFD').replace(/\p{M}/gu, '').trim()
    .replace(/^[¿¡]/, '')
    .replace(/^(?:ok(?:ay)?|si|yes)[,!]?\s+/i, '')
    .replace(/^(?:por favor|please),?\s+/i, '');
  for (const pattern of categoryCommandPatterns) {
    const match = text.match(pattern);
    if (match) {
      const body = text.slice(match[0].length).trim();
      return /[\p{L}\p{N}]/u.test(body) ? body : undefined;
    }
  }
  return undefined;
};

export const wantsCategoryCreation = (message: string): boolean =>
  categoryCommandBody(message) !== undefined;

export const guardCategoryCreation = (
  message: string,
  args: Record<string, unknown>,
  attempted: boolean,
): string | undefined => {
  if (attempted) return 'Category creation was already attempted in this request.';
  const body = categoryCommandBody(message);
  if (!body) return 'Ask explicitly to create a category and provide its name.';
  if (typeof args.name !== 'string') return 'Provide a category name.';
  const name = args.name.normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (!name || name.length > 80 || /[\p{Cc}\p{Cf}]/u.test(args.name)) {
    return 'Category name must contain 1–80 characters without control characters.';
  }
  const fold = (value: string) => value.normalize('NFKC').normalize('NFD')
    .replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ');
  const escapedName = fold(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapedName}(?:$|[^\\p{L}\\p{N}])`, 'u').test(fold(body))) {
    return 'Use the category name explicitly supplied in the current message.';
  }
  if (args.description !== undefined &&
    (typeof args.description !== 'string' || args.description.length > 500)) {
    return 'Category description must contain at most 500 characters.';
  }
  return undefined;
};

export interface CategoryCreationResult {
  success: boolean;
  error?: string;
  data?: { id: string; name: string; description?: string; duplicate: boolean };
}

export const categoryCreationReply = (
  message: string,
  result: CategoryCreationResult,
): string => {
  const spanish = /\b(?:creemos|crea|crear|creamos|categoria|puedes|podemos|quiero|agrega|anade)\b/i.test(
    message.normalize('NFD').replace(/\p{M}/gu, ''),
  );
  if (!result.success || !result.data) {
    return spanish
      ? 'No pude crear la categoría. Indica el nombre explícitamente y vuelve a intentarlo.'
      : 'I could not create the category. Specify its name explicitly and try again.';
  }
  const { name, description, duplicate } = result.data;
  if (duplicate) return spanish
    ? `La categoría «${name}» ya existe. No creé otra ni cambié su descripción.`
    : `The category “${name}” already exists. I did not create another or change its description.`;
  return spanish
    ? `Creé la categoría «${name}»${description ? `: ${description}` : '.'} Ya está disponible en tu biblioteca.`
    : `Created the category “${name}”${description ? `: ${description}` : '.'} It is now available in your library.`;
};
