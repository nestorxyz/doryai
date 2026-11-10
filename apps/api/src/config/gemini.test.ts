import assert from 'node:assert/strict';
import test from 'node:test';
import { geminiOptions, geminiModelName } from './gemini';

test('existing Gemini API configuration remains explicit', () => {
  assert.deepEqual(geminiOptions({ GEMINI_API_KEY: 'test-only' }), { vertexai: false, apiKey: 'test-only' });
  assert.throws(() => geminiOptions({}), /GEMINI_API_KEY/);
});

test('Vertex uses scoped server credentials and excludes ambient API keys', () => {
  const credentials = { type: 'service_account', project_id: 'test-project', client_email: 'synthetic@test-project.iam.gserviceaccount.com', private_key: 'synthetic-not-a-key' };
  const env = { GOOGLE_GENAI_USE_VERTEXAI: 'true', GOOGLE_CLOUD_PROJECT: 'test-project', GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify(credentials), GEMINI_API_KEY: 'ignored' };
  const options = geminiOptions(env);
  assert.equal(options.vertexai, true);
  assert.equal(options.project, 'test-project');
  assert.equal(options.location, 'global');
  assert.equal(options.apiKey, undefined);
  assert.deepEqual(options.googleAuthOptions?.credentials, credentials);
  assert.throws(() => geminiOptions({ ...env, GOOGLE_CLOUD_PROJECT: 'other-project' }), /configured project/);
  assert.throws(() => geminiOptions({ ...env, GOOGLE_SERVICE_ACCOUNT_JSON: '{}' }), /service account/);
  assert.throws(() => geminiOptions({ ...env, GOOGLE_SERVICE_ACCOUNT_JSON: 'secret-invalid-json' }), error => error instanceof Error && !error.message.includes('secret-invalid-json'));
});

test('model selection keeps existing default and accepts an explicit override', () => {
  assert.equal(geminiModelName({}), 'gemini-2.5-flash');
  assert.equal(geminiModelName({ GEMINI_MODEL: 'gemini-3.8-flash' }), 'gemini-3.8-flash');
});
