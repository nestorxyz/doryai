import { GoogleGenAI, type GoogleGenAIOptions } from '@google/genai';

export function geminiOptions(env: NodeJS.ProcessEnv = process.env): GoogleGenAIOptions {
  if (env.GOOGLE_GENAI_USE_VERTEXAI !== 'true') {
    const apiKey = env.GEMINI_API_KEY || env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is required');
    return { vertexai: false, apiKey };
  }
  const project = env.GOOGLE_CLOUD_PROJECT;
  if (!project) throw new Error('GOOGLE_CLOUD_PROJECT is required for Vertex AI');
  let credentials;
  try {
    credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON || 'null');
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON must be valid JSON');
  }
  if (!credentials || credentials.type !== 'service_account' ||
      typeof credentials.client_email !== 'string' || !credentials.client_email ||
      typeof credentials.private_key !== 'string' || !credentials.private_key ||
      credentials.project_id !== project) {
    throw new Error('Vertex AI requires service account credentials for the configured project');
  }
  return {
    vertexai: true, project, location: env.GOOGLE_CLOUD_LOCATION || 'global',
    googleAuthOptions: { credentials },
  };
}

export function createGeminiClient(): GoogleGenAI {
  return new GoogleGenAI(geminiOptions());
}

export function geminiModelName(env: NodeJS.ProcessEnv = process.env): string {
  return env.GEMINI_MODEL || 'gemini-2.5-flash';
}
