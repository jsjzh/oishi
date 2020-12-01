declare type TextType = '' | 'text' | 'title' | 'quote' | 'link' | 'image' | 'list' | 'divider' | 'line';
declare type Text = string | number;
interface ITextInterface {
    type: TextType;
    text: string;
    pre?: ITextInterface | null;
    next?: ITextInterface | null;
    preRender: (currText: ITextInterface) => string;
    nextRender: (currText: ITextInterface) => string;
}
export default class MdCreator {
    static create(document?: string): MdCreator;
    protected base: string;
    protected head: ITextInterface;
    protected curr: ITextInterface;
    constructor(document?: string);
    text(text: Text): this;
    title(deep: 1 | 2 | 3 | 4 | 5 | 6, text: Text): this;
    quote(text: Text): this;
    link(url: string, placeholder?: Text): this;
    image(imageUrl: string, placeholder?: Text): this;
    list(arr: Text[]): this;
    listNum(arr: Text[]): this;
    divider(): this;
    line(): this;
    output(): string;
    protected next(obj: ITextInterface): this;
}
export {};
