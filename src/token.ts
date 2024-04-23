import {Token} from "./types";
import {P, match} from "ts-pattern";

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
                // TODO: Rewrite this to avoid messy ptr movement.
                let value = "";
                char = input[++ptr]; 
                while (char !== '"') {
                    value += char;
                    char = input[++ptr];
                }
                tokens.push({type: "String", value});
                ptr++;
            })
            /*
            Big Problem below. Suppose we have a key "id". 
            Then it successfully grabs id and puts it in value above <- This 
            happens for the current character being i.
            Then the next current character (lol) is d and it matches the below regex. So ultimately things collide. 
            ~~TODO: Fix this. Urgent.~~ FIXED.
            */ 
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