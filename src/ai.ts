import { createOpenAI, type OpenAIProviderSettings } from '@ai-sdk/openai';
import 'dotenv/config';
import { createDeepSeek, type DeepSeekProviderSettings } from '@ai-sdk/deepseek';

interface CustomOpenAIProviderSettings extends OpenAIProviderSettings {
    baseURL?: string;
}

// Providers
const openai = createOpenAI({
    apiKey: process.env.OPENAI_KEY!,
    baseURL: process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1',
} as CustomOpenAIProviderSettings);

const customModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

interface CustomDeepseekProviderSettings extends DeepSeekProviderSettings {
    baseURL?: string;
}


export const deepseek = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY!,
    baseURL: 'https://api.deepseek.com/v1'
} as CustomDeepseekProviderSettings);

// Models

export const o3MiniModel = openai(customModel, {
    reasoningEffort: customModel.startsWith('o') ? 'medium' : undefined,
    structuredOutputs: true,
});

export const o3Dot5TurboModel = openai(customModel, {
    reasoningEffort: customModel.startsWith('o') ? 'medium' : undefined,
    structuredOutputs: true,
});
