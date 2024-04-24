import { docopt } from 'docopt';
import { tokenizer } from './token';
import path from 'path';
import * as fs from 'fs';
import { parser } from './parser';

const doc = `
Usage:
  main.js <file> [--tokens]

Options:
  -h, --help       Show this help message and exit.
  --tokens, -t    Show extra information.

Examples:
  main.js input.txt
`;

const args = docopt(doc, { version: '1.0.0' });

const filePath: string = args['<file>'];

if (!filePath) {
    console.error('Please provide a file path.');
    process.exit(1);
}

const absolutePath = path.resolve(filePath);

try {
    const fileContent: string = fs.readFileSync(absolutePath, 'utf-8');
    const tokens = tokenizer(fileContent);

    if (args['--tokens']) {
        console.log('Tokens:', tokens);
    } else {
        console.log('Tokenized successfully.');
        console.log('AST after parsing: ');
        console.log(parser(tokens));
    }
} catch (err) {
    console.error('Error reading or tokenizing file:', err.message);
    process.exit(1);
}
