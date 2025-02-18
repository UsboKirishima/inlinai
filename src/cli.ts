import { Command } from "commander";
import { o3MiniModel, deepseek, o3Dot5TurboModel } from "./ai";
import { generateText } from "ai";
import PROMPTS from "./prompts";
import { generateHfText } from "./hf";
import { OutputParser } from "./output";
import { Process } from "./process";
import * as readline from 'readline';
import { exitCode } from "process";


const {
  BLACK,
  RED,
  GREEN,
  YELLOW,
  BLUE,
  MAGENTA,
  CYAN,
  WHITE,
  RESET,
  BRIGHT_BLACK,
  BRIGHT_RED,
  BRIGHT_GREEN,
  BRIGHT_YELLOW,
  BRIGHT_BLUE,
  BRIGHT_MAGENTA,
  BRIGHT_CYAN,
  BRIGHT_WHITE,
} = OutputParser.colors;

export const program = new Command();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(question + ' (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        resolve(true);
      } else if (answer.toLowerCase() === 'n') {
        resolve(false);
      } else {
        console.log('Please answer with "y" or "n".');
        resolve(false);
      }
    });
  });
}

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
    const output = await generateHfText(PROMPTS.baseLinux + fullPrompt);

    const command = OutputParser.parseFirstCommand(output.generated_text);
    console.log(BRIGHT_GREEN + ' + ' + GREEN + '` ' +  command + ' `' + RESET);

    if(!command) console.log('DEBUG No output, original text: ' + output.generated_text.replace(PROMPTS.baseLinux, ''));

    askQuestion(BRIGHT_MAGENTA + 'Do you want to continue?' + RESET).then((answer) => {
      if (!answer) {
        console.log(RED + 'Exiting.' + RESET);
        return process.exit(0);
      }

      const process_ = new Process(command);

      process_.on('stdout', (data) => {
        console.log(OutputParser.colors.BRIGHT_BLUE + data + OutputParser.colors.RESET);
      });

      process_.on('stderr', (data) => {
        console.error(OutputParser.colors.BRIGHT_RED + 'Error:', data + OutputParser.colors.RESET);
      });

      process_.on('close', (code) => {
        console.log(`Process finished with code ${code}`);
      });

      process_.on('error', (err) => {
        console.error('Failed to start process:', err);
      });


      rl.close();
    });

  })

program.parse(process.argv);