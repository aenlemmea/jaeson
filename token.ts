import {Token} from "./types";
import {P, match} from "ts-pattern";

export const tokenizer = (input: string): Token[] => {
    const tokens: Token[] = [];
    let ptr = 0;
    for (let char of input) {
        ptr++;
        match(char)
            .with("{", () => tokens.push({type: "BraceOpen", value: char}))
            .with('}', () => tokens.push({type: "BraceClose", value: char}))
            .with("[", () => tokens.push({type: "BracketOpen", value: char}))
            .with("]", () => tokens.push({type: "BracketClose", value: char}))
            .with(":", () => tokens.push({type: "Colon", value: char}))
            .with(",", () => tokens.push({type: "Comma", value: char}))

    }
    return tokens;
}