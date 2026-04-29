import { Node, Unit } from "../types/models";
import { isString, unitToNode } from "../utils";
type HTMLNode = globalThis.Node;

type InsertionMode = "firstChild" | "lastChild";

function render(node: Node): HTMLNode {
    
    const pointer = node.pointer;
    if(!pointer){
        return document.createTextNode(node.text);
    }
    const element = document.createElement(pointer.tag ?? "div");
    pointer.id && (element.id = pointer.id);
    element.className = pointer.classes.join(" ");
    pointer.props.forEach( ([prop, value]) => (element as any)[prop] = value);

    node.text && (element.textContent = node.text);
    node.children.forEach(child => element.appendChild(render(child)));

    return element;
}
export function fmFn(selector: string): HTMLElement | HTMLElement[];
export function fmFn(unit: Unit): HTMLElement;
export function fmFn(arg1: Unit | string): HTMLElement | HTMLElement[] {
    if(isString(arg1)){
        if(arg1.charAt(0) === "*"){
            return [...document.querySelectorAll(arg1.slice(1))].map(el => el as HTMLElement);
        } else {
            return document.querySelector(arg1) as HTMLElement;
        }
    } else {
        return render(unitToNode(arg1)) as HTMLElement;
    }
}

export function remove(element: HTMLElement): void {
    element.remove();
}

export function insert(element: HTMLElement, container: HTMLNode = document.body, mode: InsertionMode = "lastChild"): void {
    switch(mode){
        case 'firstChild': {
            container.insertBefore(element, container.firstChild); 
            return;
        }
        case 'lastChild': {
            container.appendChild(element); 
            return;
        }
    }
}

