// @ts-nocheck
import { fmFn, insert, remove, substitute } from "./functions/fm.function";
import { style } from "./functions/style.function";
import { on } from "./functions/on.function";

globalThis.fm = function (arg1) {
    Object.assign( fm, {
        style, 
        on, 
        remove, 
        insert, 
        substitute
    });
    
    return fmFn(arg1);
}

globalThis.fm();