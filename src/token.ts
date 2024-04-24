import {Token} from "./types";
import {P, match} from "ts-pattern";

const tokenizeString = (input: string, ptr: number): [string, number] => {
    const value = input.substring(ptr + 1, input.indexOf('"', ptr + 1));
    return [value, ptr + value.length + 2];
};

export const tokenizer = (input: string): Token[] => {
    const tokens: Token[] = [];
    let ptr = 0;

    while(ptr < input.length) {
        let char = input[ptr];
        match(char)
            .with("{", () => {
                tokens.push({type: "BraceOpen", value: char});
                ptr++;
            })
            .with('}', () => {
                tokens.push({type: "BraceClose", value: char});
                ptr++;
            })
            .with("[", () => {
                tokens.push({type: "BracketOpen", value: char});
                ptr++;
            })
            .with("]", () => {
                tokens.push({type: "BracketClose", value: char});
                ptr++;
            })
            .with(":", () => {
                tokens.push({type: "Colon", value: char});
                ptr++;
            })
            .with(",", () => {
                tokens.push({type: "Comma", value: char});
                ptr++;
            })
            .with('"', () => {
                const [value, newPtr] = tokenizeString(input, ptr);
                tokens.push({ type: 'String', value });
                ptr = newPtr;
            })
            .with(P.string.regex(/[\d\w]/), () => {
                let value = "";
                while(/[\d\w]/.test(char)) {
                    value += char;
                    char = input[++ptr];
                }
                match(value)
                    .with(P.string.regex(/\d/), () => tokens.push({type: "Number", value}))
                    .with(P.string.regex(/null|undefined/), () => tokens.push({type: "Null", value}))
                    .with(P.string.regex(/true|false/), () => {
                        if (value === "true") {
                            tokens.push({type: "True", value});
                        } else {
                            tokens.push({type: "False", value});
                        }
                    })
                    .otherwise(() => {
                        throw new Error("Unrecognized Value: " + value);
                    })
            })
            .with(P.string.regex(/\s/), () => {
                ptr++;
            })
            .otherwise(() => {
                throw new Error("Unexpected Character");
            })
    }
    return tokens;
}