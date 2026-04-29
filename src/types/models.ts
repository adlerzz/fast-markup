export type Descriptor = string;
export type Text = string;
type Children = Array<Unit | Text>

export interface Unit {
    [descriptor: Descriptor]: Text | Children;
}

export interface Pointer {
    tag?: string;
    classes: Array<string>;
    props: Array<[string, unknown]>;
    id?: string;
}

export interface Node {
    pointer: Pointer | null;
    text: Text;
    children: Array<Node>;
}

/*styles */
export interface Styles {
    [property: string]: string | Styles;
}

export interface Stylesheet {
    [selector: string]: Styles;
}