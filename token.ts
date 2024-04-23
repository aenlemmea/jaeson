import {Token} from "./types";
import {P, match} from "ts-pattern";

export const tokenizer = (input: string): Token[] => {
    const tokens: Token[] = [];
    let ptr = 0;
    let currentString = '';
    for (let char of input) {
        ptr++;
        match(char)
            .with("{", () => tokens.push({type: "BraceOpen", value: char}))
            .with('}', () => tokens.push({type: "BraceClose", value: char}))
            .with("[", () => tokens.push({type: "BracketOpen", value: char}))
            .with("]", () => tokens.push({type: "BracketClose", value: char}))
            .with(":", () => tokens.push({type: "Colon", value: char}))
            .with(",", () => tokens.push({type: "Comma", value: char}))
            .with('"', () => {
                let value = "";
                char = input[ptr++];
                while (char !== '"') {
                    value += char;
                    char = input[ptr++];
                }
                tokens.push({type: "String", value})
                ptr++;
            })
            .with(P.string.regex(/[\d\w]/), () => {
                let value = "";
                while(/[\d\w]/.test(char)) {
                    value += char;
                    char = input[++ptr];
                }
                match(value)
                .with(P.number, () => tokens.push({type: "Number", value}))
                .with(P.nullish, () => tokens.push({type: "Null", value}))
                .with(P.boolean, () => {
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
            .with(P.string.regex(/\s/), () => {})
            .otherwise(() => {
                throw new Error("Unexpected Character");
            })
    }
    return tokens;
}