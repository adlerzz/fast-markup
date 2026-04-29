import { Descriptor } from "../types/models";

export function on(descriptor: Descriptor, action: (event: Event) => void): Function {
    const [,selector, event, sOptions] = [...descriptor.match(/([^@]*)@([^\.]*)(.*)/) ?? []];
    const options = sOptions ? Object.fromEntries( sOptions?.split(".").filter(Boolean).map(option => ([option, true]))) : {};
    const element = document.querySelector(selector);
    if(!element){
        throw new Error(`selector "${selector}" doesn't match any elements`);
    }
    element.addEventListener(event, action, options);
    return () => {
        element.removeEventListener(event, action);
    }
};