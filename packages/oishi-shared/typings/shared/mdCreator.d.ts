declare type TextType = '' | 'text' | 'title' | 'quote' | 'link' | 'image' | 'list' | 'divider' | 'line';
declare type Text = string | number;
export default class MdCreator {
    static from(document?: string): MdCreator;
    protected document: string;
    protected preType: TextType;
    constructor(docuemnt?: string);
    text(text: Text): this;
    title(deep: 1 | 2 | 3 | 4 | 5 | 6, text: Text): this;
    quote(text: Text): this;
    link(url: string, title?: Text): this;
    image(imageUrl: string, title?: Text): this;
    list(arr: Text[]): this;
    listNum(arr: Text[]): this;
    divider(): this;
    line(): this;
    output(): string;
    protected __editBefore(pre: TextType, curr: TextType): "" | "\n\n" | "  \n";
    protected __editAfter(pre: TextType, curr: TextType): "" | "\n\n";
    protected __edit(type: TextType, curr: string): this;
}
export {};
