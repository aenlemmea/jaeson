import { match } from "ts-pattern";
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
            } else {
                throw new Error(`Expected String key in object. Token type: ${token.type}`);
                // Main edge case. To do, have failsafety.
            }
            token = next();
            if (token.type === "Comma") token = next();
        }
        return current;
    }


    function parseArray() : ASTNode {
        const current: ASTNode = { type: "Array", value: [] };
        let token = next();
    
        while (token.type !== "BracketClose") {
            const value = parseValue();
            current.value.push(value);
    
            token = next();
            if (token.type === "Comma") token = next();
        }
    
        return current;
    }
        
        

    const AST = parseValue();
    return AST;
}
