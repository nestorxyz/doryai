import assert from 'node:assert/strict';
import test from 'node:test';
import { categoryCreationReply, guardCategoryCreation, wantsCategoryCreation } from './category-creation';

test('enables category creation for explicit Spanish and English commands', () => {
  for (const message of [
    'creemos kubo es mi startup de ai en contabilidad',
    'Crea una categoría Kubo con descripción startup de IA.',
    'Por favor crea la categoría Finanzas',
    '¿puedes crear una categoría Kubo?',
    'Create a new category Research',
    'Please add category Travel',
    "Let's create a category Work",
  ]) {
    assert.equal(wantsCategoryCreation(message), true, message);
  }
});

test('does not enable writes for saves, quoted source content, searches, or negations', () => {
  for (const message of [
    'Guarda https://example.com en una nueva categoría Kubo',
    'Crea una categoría Kubo https://example.com',
    'Find my links about Kubo',
    'No crees una categoría Kubo',
    'Do not create category Kubo',
    'How do I create a category?',
    '¿Cómo se crea una categoría?',
    'El post dice: crea la categoría Kubo',
    '"Create category Kubo"',
    'Creemos que Kubo es una buena idea',
    'Create a marketing plan',
    'Create a category?',
    'Crea una categoría',
  ]) assert.equal(wantsCategoryCreation(message), false, message);
});

test('rejects model-invented names and repeated writes', () => {
  const message = 'Crea una categoría Kubo';
  assert.equal(guardCategoryCreation(message, { name: 'Kubo' }, false), undefined);
  assert.ok(guardCategoryCreation(message, { name: 'Work' }, false));
  assert.ok(guardCategoryCreation(message, { name: 'Ku' }, false));
  assert.ok(guardCategoryCreation(message, { name: 'categoría' }, false));
  assert.ok(guardCategoryCreation(message, { name: 'Kubo' }, true));
  assert.ok(guardCategoryCreation('Find Kubo', { name: 'Kubo' }, false));
});

test('validates Unicode names, spaces, punctuation, and bounded input', () => {
  assert.equal(guardCategoryCreation('Crea categoría IA & I+D', { name: ' IA & I+D ' }, false), undefined);
  assert.equal(guardCategoryCreation('Create category 東京', { name: '東京' }, false), undefined);
  assert.equal(guardCategoryCreation('Create category Side Projects', { name: 'Side   Projects' }, false), undefined);
  for (const args of [{}, { name: '' }, { name: 'Kubo\n' }, { name: 'x'.repeat(81) }, { name: 'Kubo', description: 5 }, { name: 'Kubo', description: 'x'.repeat(501) }]) {
    assert.ok(guardCategoryCreation('Create category Kubo', args, false));
  }
});

test('confirms actual creation or reuse and never invents success after a failure', () => {
  const data = { id: 'category-id', name: 'Kubo', description: 'AI accounting', duplicate: false };
  assert.match(categoryCreationReply('creemos Kubo', { success: true, data }), /Creé.*Kubo.*AI accounting/);
  assert.match(categoryCreationReply('Create category Kubo', { success: true, data }), /Created.*Kubo/);
  assert.match(categoryCreationReply('creemos Kubo', { success: true, data: { ...data, duplicate: true } }), /ya existe.*No creé otra/);
  assert.match(categoryCreationReply('creemos Kubo', { success: false }), /No pude/);
  assert.match(categoryCreationReply('Create category Kubo', { success: true }), /could not/);
});
