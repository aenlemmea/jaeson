import { P, match } from "ts-pattern";
import { ASTNode, Token } from "./types";

export const parser = (tokens: Token[]): ASTNode => {
    if (!tokens.length) {
        throw new Error("No tokens found.");
    }

    let counter = 0;

    function next() {
        return tokens[++counter];
    }

    function parseValue() : ASTNode {
        const token = tokens[counter];
        match(token.type)
        .with("String", () => {
            return {type: "String", value: token.value};
        })
        .with("Number", () => {
            return {type: "Number", value: Number(token.value)};
        })
        .with("True", () => {
                return {type: "Boolean", value: true};
        })
        .with("False", () => {
            return {type: "Boolean", value: false};
        })
        .with("Null", () => {
            return {type:"Null"};
        })
        .with("BraceOpen", () => {
            return parseObject();
        })
        .with("BracketOpen", () => {
            return parseArray();
        })
        .otherwise(() => {
            throw new Error(`Unexpected token type: ${token.type}`);
        })
    }
}

function parseObject(): any {
    throw new Error("Function not implemented.");
}


function parseArray() {
    throw new Error("Function not implemented.");
}
