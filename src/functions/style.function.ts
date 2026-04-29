import { Styles, Stylesheet } from "../types/models";
import { isObject, isString, uuid } from "../utils";

const INDENT = "    ";

function stringifyStyle(obj: Stylesheet | Styles, level = 0): string {
    const [[selector, node]] = Object.entries(obj);
    const indent = INDENT.repeat(level);

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

    const result = `${indent}${selector} {\n` + entries.join('\n') + `\n${indent}}`;
    return result;
};

export function style(input: Stylesheet): Function {
    const styleElement = document.createElement('style');

    styleElement.innerHTML = stringifyStyle(input);
    document.head.append(styleElement);
    return () => {
        styleElement.remove();
    };
}