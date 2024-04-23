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
        let result: ASTNode = { type: "Null"}; ;
        match(token.type)
            .with("String", () => {
                result = {type: "String", value: token.value};
            })
            .with("Number", () => {
                result = {type: "Number", value: Number(token.value)};
            })
            .with("True", () => {
                result = {type: "Boolean", value: true};
            })
            .with("False", () => {
                result = {type: "Boolean", value: false};
            })
            .with("Null", () => {
                result = {type:"Null"};
            })
            .with("BraceOpen", () => {
                result = parseObject();
            })
            .with("BracketOpen", () => {
                result = parseArray();
            })
            .otherwise(() => {
                throw new Error(`Unexpected token type: ${token.type}`);
            });

        return result;
    }


    function parseObject() : ASTNode {
        const current : ASTNode = {type: "Object", value: {}};
        let token = next();

        while(token.type !== "BraceClose") {
            if(token.type === "String") {
                const key = token.value;
                token = next();
                if (token.type !== "Colon") throw new Error("Expexted: in key-value pair");
                token = next();
                const value = parseValue();
                current.value[key] = value;
            }
        }
        return current;
    }


    function parseArray() : ASTNode {
        throw new Error("Function not implemented.");
    }

    const AST = parseValue();
    return AST;
}
