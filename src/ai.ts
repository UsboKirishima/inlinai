import { createOpenAI, type OpenAIProviderSettings } from '@ai-sdk/openai';
import 'dotenv/config';

interface CustomOpenAIProviderSettings extends OpenAIProviderSettings {
    baseURL?: string;
}

// Providers
const openai = createOpenAI({
    apiKey: process.env.OPENAI_KEY!,
    baseURL: process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1',
} as CustomOpenAIProviderSettings);

const customModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Models

export const o3MiniModel = openai(customModel, {
    reasoningEffort: customModel.startsWith('o') ? 'medium' : undefined,
    structuredOutputs: true,
});
