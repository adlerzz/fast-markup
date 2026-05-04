import { Styles, Stylesheet } from "../types/models";
import { isObject, isString } from "../utils";

const INDENT = "    ";

function stringifyStyle(obj: Stylesheet | Styles, level = 0): string {
    const indent = INDENT.repeat(level);

    return [...Object.entries(obj)].map( ([selector, node]) => {
        if(!(isObject(node))){
            return "";
        }

        const entries = Object.entries(node).map( ([prop, value]) => {
            switch(true){
                case isString(value): return `${INDENT}${indent}${prop}: ${value};`;
                case isObject(value): return stringifyStyle({[prop]: value} as Styles, level + 1);
                default: return "";
            }
        } )

        return `${indent}${selector} {\n` + entries.join("\n") + `\n${indent}}`;
    } ).join("\n") ;

};

export function style(input: Stylesheet): Function {
    const styleElement = document.createElement('style');

    styleElement.innerHTML = stringifyStyle(input);
    document.head.append(styleElement);
    return () => {
        styleElement.remove();
    };
}