import { Node, Text, Pointer, Unit } from "./types/models";

export function isString(x: unknown): x is string {
    return typeof x === "string";
}

export function isArray(x: unknown): x is Array<unknown> {
    return Array.isArray(x);
}

export function isObject(x: unknown): x is Record<string, unknown> {
    return x !== null && typeof x === "object";
}

export function splitAs(text: string, template: RegExp): string[] {
    return [...(text ?? "").matchAll(template)]?.map(([,it]) => it);
}

function parseDescriptor(desc: string): Pointer {
    if (!desc) {
        throw new TypeError("empty descriptor");
    }
    const [ , sTag, sClasses, sProps, sId] = [...desc?.match(/([^\.#[]*)([^[#]*)?(\[.*\])?(#.*)?/) ?? []];
    const tag = sTag?.length ? sTag : "div";
    const classes = splitAs(sClasses, /\.([^.]+)/g);
    const props = splitAs(sProps, /\[(.*?)\]/g).map(prop => prop.split("=") as [string, string]);
    const id = sId?.slice(1);
    return {tag, classes, props, id};
}

function createTextNode(text: Text): Node {
    return {
        pointer: null,
        text,
        children: []
    };
} 

function childUnitToNode(child: Text | Unit): Node {
    return isString(child) ? createTextNode(child): unitToNode(child);
}

export function unitToNode(unit: Unit): Node {
    const [[descriptor, node]] = Object.entries(unit);

    return {
        pointer: parseDescriptor(descriptor),
        text: isString(node) ? node : "",
        children: isArray(node) ? node.map(child => childUnitToNode(child)) : [],
    }
    
}