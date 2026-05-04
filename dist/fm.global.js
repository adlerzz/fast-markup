(function () {
    'use strict';

    function isString(x) {
        return typeof x === "string";
    }
    function isArray(x) {
        return Array.isArray(x);
    }
    function isObject(x) {
        return x !== null && typeof x === "object";
    }
    function splitAs(text, template) {
        return [...(text ?? "").matchAll(template)]?.map(([, it]) => it);
    }
    function parseDescriptor(desc) {
        if (!desc) {
            throw new TypeError("empty descriptor");
        }
        const [, sTag, sClasses, sProps, sId] = [...desc?.match(/([^\.#[]*)([^[#]*)?(\[.*\])?(#.*)?/) ?? []];
        const tag = sTag?.length ? sTag : "div";
        const classes = splitAs(sClasses, /\.([^.]+)/g);
        const props = splitAs(sProps, /\[(.*?)\]/g).map(prop => prop.split("="));
        const id = sId?.slice(1);
        return { tag, classes, props, id };
    }
    function createTextNode(text) {
        return {
            pointer: null,
            text,
            children: []
        };
    }
    function childUnitToNode(child) {
        return isString(child) ? createTextNode(child) : unitToNode(child);
    }
    function unitToNode(unit) {
        const [[descriptor, node]] = Object.entries(unit);
        return {
            pointer: parseDescriptor(descriptor),
            text: isString(node) ? node : "",
            children: isArray(node) ? node.map(child => childUnitToNode(child)) : [],
        };
    }

    function render(node) {
        const pointer = node.pointer;
        if (!pointer) {
            return document.createTextNode(node.text);
        }
        const element = document.createElement(pointer.tag);
        pointer.id && (element.id = pointer.id);
        pointer.classes?.length && (element.className = pointer.classes.join(" "));
        pointer.props.forEach(([prop, value]) => element[prop] = JSON.parse(value));
        node.text && (element.textContent = node.text);
        node.children.forEach(child => element.appendChild(render(child)));
        return element;
    }
    function fmFn(arg1) {
        if (arg1 === undefined) {
            return;
        }
        if (isString(arg1)) {
            if (arg1.charAt(0) === "*") {
                return [...document.querySelectorAll(arg1.slice(1))].map(el => el);
            }
            else {
                return document.querySelector(arg1);
            }
        }
        else {
            return render(unitToNode(arg1));
        }
    }
    function remove(element) {
        element.remove();
    }
    function insert(element, container = document.body, mode = "lastChild") {
        switch (mode) {
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
    function substitute(into, sources) {
        Object.entries(sources).forEach(([id, input]) => {
            const place = into.querySelector(`template#${id}`);
            if (!place) {
                throw new Error(`no template with id "${id}"`);
            }
            if (isArray(input)) {
                input.forEach(element => place.insertAdjacentElement("beforebegin", element));
            }
            else {
                place.insertAdjacentElement('beforebegin', input);
            }
            place.remove();
        });
    }

    const INDENT = "    ";
    function stringifyStyle(obj, level = 0) {
        const indent = INDENT.repeat(level);
        return [...Object.entries(obj)].map(([selector, node]) => {
            if (!(isObject(node))) {
                return "";
            }
            const entries = Object.entries(node).map(([prop, value]) => {
                switch (true) {
                    case isString(value): return `${INDENT}${indent}${prop}: ${value};`;
                    case isObject(value): return stringifyStyle({ [prop]: value }, level + 1);
                    default: return "";
                }
            });
            return `${indent}${selector} {\n` + entries.join("\n") + `\n${indent}}`;
        }).join("\n");
    }
    function style(input) {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = stringifyStyle(input);
        document.head.append(styleElement);
        return () => {
            styleElement.remove();
        };
    }

    function on(descriptor, action) {
        const [, selector, event, sOptions] = [...descriptor.match(/([^@]*)@([^\.]*)(.*)/) ?? []];
        const options = sOptions ? Object.fromEntries(sOptions?.split(".").filter(Boolean).map(option => ([option, true]))) : {};
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`selector "${selector}" doesn't match any elements`);
        }
        element.addEventListener(event, action, options);
        return () => {
            element.removeEventListener(event, action);
        };
    }

    // @ts-nocheck
    globalThis.fm = function (arg1) {
        Object.assign(fm, {
            style,
            on,
            remove,
            insert,
            substitute
        });
        return fmFn(arg1);
    };
    globalThis.fm();

})();
