export class OutputParser {

    public constructor() { };

    public static colors = {
        BLACK: '\x1b[30m',
        RED: '\x1b[31m',
        GREEN: '\x1b[32m',
        YELLOW: '\x1b[33m',
        BLUE: '\x1b[34m',
        MAGENTA: '\x1b[35m',
        CYAN: '\x1b[36m',
        WHITE: '\x1b[37m',
        RESET: '\x1b[0m',
        BRIGHT_BLACK: '\x1b[90m',
        BRIGHT_RED: '\x1b[91m',
        BRIGHT_GREEN: '\x1b[92m',
        BRIGHT_YELLOW: '\x1b[93m',
        BRIGHT_BLUE: '\x1b[94m',
        BRIGHT_MAGENTA: '\x1b[95m',
        BRIGHT_CYAN: '\x1b[96m',
        BRIGHT_WHITE: '\x1b[97m'
    };
    

    private static markdownRegex: RegExp = /(?:\*\*|__)[^\*]+(?:\*\*|__)|(?:\*|_)[^\*]+(?:\*|_)|\[([^\]]+)\]\([^\)]+\)|!\[([^\]]+)\]\([^\)]+\)|^#{1,6} .+|-\s.*|(\*\s.*)|^\d+\.\s.*|> .+|```[\s\S]*?```|\|\s.*\||[-]{3,}/;

    public static isMarkdownText(text: string): boolean {
        return this.markdownRegex.test(text);
    }

    public static removeMarkdown(text: string): string {

        if(!this.isMarkdownText(text)) return '';

        text = text.replace(/(?:\*\*|__)(.*?)\1(?:\*\*|__)/g, '$1');  // Bold and Cursive
        
        text = text.replace(/(?:\*|_)(.*?)\1(?:\*|_)/g, '$1'); // Cursive

        text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Link

        text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1'); // Images

        text = text.replace(/^#{1,6} (.*)$/gm, '$1'); // Heading

        text = text.replace(/^\s*[\*\-\+]\s+(.*)$/gm, '$1'); // Unordered Lists

        text = text.replace(/^\s*\d+\.\s+(.*)$/gm, '$1'); // Ordered Lists

        text = text.replace(/^> (.*)$/gm, '$1'); // Cits

        text = text.replace(/```[\s\S]*?```/g, ''); // Code blocks

        text = text.replace(/[-]{3,}/g, ''); // Horizontal line

        text = text.replace(/\|.*\|/g, ''); // tables

        return text.trim(); // remove white spaces
    }

    public static parseFirstCommand(text: string): string {
        if (!this.isMarkdownText(text)) return '';
    
        const lines: Array<string> = text.split('\n');
        let output: string = '';
        let insideCodeBlock = false;
    
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
    
            if (line.includes('```')) {
                insideCodeBlock = !insideCodeBlock;
                continue;
            }
    
            if (insideCodeBlock) {
                output += line + '\n';
            }
    
            if (insideCodeBlock && (line.includes('```'))) {
                break;
            }
        }
    
        return output.trim();
    }

    public static parseAllCommands(text: string): Array<string> {
        if (!this.isMarkdownText(text)) return [];
    
        const lines: Array<string> = text.split('\n');
        let output: string = '';
        let results: Array<string> = [];
        let insideCodeBlock = false;
    
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
    
            if (line.includes('```')) {
                if (insideCodeBlock) {
                    results.push(output.trim());
                    output = '';
                }
                insideCodeBlock = !insideCodeBlock;
                continue;
            }
    
            if (insideCodeBlock) {
                output += line + '\n';
            }
        }
    
        return results;
    }
    
}