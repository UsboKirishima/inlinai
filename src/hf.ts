import 'dotenv/config'
import { HfInference, type TextGenerationOutput } from '@huggingface/inference'

export const hf = new HfInference(process.env.HF_API_KEY);

export async function generateHfText(prompt: string): Promise<TextGenerationOutput> {
    const out = await hf.textGeneration({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        inputs: prompt || "Say to me \'Error, no input provided!\' using fantasy",
        //max_tokens: 512,
        //temperature: 0.1,
      });

    return out;
}