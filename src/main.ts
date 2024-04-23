import { parser } from "./parser";
import { tokenizer } from "./token";

console.log(parser(tokenizer(`{
    "id": "nice",
    "index": 0,
    "something": [],
    "boolean": true,
    "nullValue": null 
}`)))