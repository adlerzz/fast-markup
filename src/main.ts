// @ts-nocheck
import { fmFn, insert, remove } from "./functions/fm.function";
import { style } from "./functions/style.function";
import { on } from "./functions/on.function";

globalThis.fm = function (arg1) {
    fm.style = style;
    fm.on = on;
    fm.remove = remove;
    fm.insert = insert;
    return fmFn(arg1);
}

