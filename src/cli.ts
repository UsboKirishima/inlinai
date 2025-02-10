import { Command } from "commander";
import { o3MiniModel } from "./ai";
import { generateText } from "ai";
import PROMPTS from "./prompts";

export const program = new Command();

program
  .name("inl")
  .description("AI Based prompt-command generating")
  .version("1.0.0");

program
  .command('gen')
  .argument('<chars...>', 'Text prompt')
  .description('Generate command from text prompt')
  .action(async (chars) => {
    const fullPrompt = chars.join(' ');
    const { text } = await generateText({
      model: o3MiniModel,
      prompt: PROMPTS.baseLinux + fullPrompt,
    });

    console.log(text);
  })

program.parse(process.argv);