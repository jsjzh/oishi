type TextType =
  | ''
  | 'text'
  | 'title'
  | 'quote'
  | 'link'
  | 'image'
  | 'list'
  | 'divider'
  | 'line';

type Text = string | number;

export default class MdCreator {
  static from(document?: string) {
    return new MdCreator(document);
  }

  protected document: string;
  protected preType: TextType;

  constructor(docuemnt = '') {
    this.document = docuemnt;
    this.preType = '';
  }

  text(text: Text) {
    const curr = `${text}`;
    return this.__edit('text', curr);
  }

  title(deep: 1 | 2 | 3 | 4 | 5 | 6, text: Text) {
    const curr = `${new Array(deep).fill('#').join('')} ${text}`;
    return this.__edit('title', curr);
  }

  quote(text: Text) {
    const curr = `> ${text}`;
    return this.__edit('quote', curr);
  }

  link(url: string, title?: Text) {
    const curr = `[${title || ''}](${url})`;
    return this.__edit('link', curr);
  }

  image(imageUrl: string, title?: Text) {
    const curr = `![${title || ''}](${imageUrl})`;
    return this.__edit('image', curr);
  }

  list(arr: Text[]) {
    const curr = arr.reduce(
      (pre, curr, index) =>
        index === arr.length - 1 ? `${pre}- ${curr}` : `${pre}- ${curr}\n`,
      '',
    );
    return this.__edit('list', `${curr}`);
  }

  listNum(arr: Text[]) {
    const curr = arr.reduce(
      (pre, curr, index) =>
        index === arr.length - 1
          ? `${pre}${index + 1}. ${curr}`
          : `${pre}${index + 1}. ${curr}\n`,
      '',
    );
    return this.__edit('list', `${curr}`);
  }

  divider() {
    const curr = '---';
    return this.__edit('divider', curr);
  }

  line() {
    const curr = '\n\n';
    return this.__edit('line', curr);
  }

  output() {
    return this.document;
  }

  protected __editBefore(pre: TextType, curr: TextType) {
    const newSpaceType = ['text', 'quote'];
    const newLineType = ['title', 'image', 'list', 'divider'];
    // 如果 pre 和 curr 都是 text 或者 quote，则通过「  \n」来分行
    if (pre === curr && newSpaceType.includes(curr)) return '  \n';
    // 如果 pre 和 curr 都已经走过 \n\n 逻辑，则不再分行
    if (newLineType.includes(pre) && newLineType.includes(curr)) return '';
    // 第一个是对于特殊类型分行
    // 第二个是对于 text 和 quote 写一起的时候，为了美观，需要用 quote，因为 text 和 quote 都是属于行内元素
    if (newLineType.includes(curr) || (pre === 'text' && curr === 'quote'))
      return '\n\n';
    return '';
  }

  protected __editAfter(pre: TextType, curr: TextType) {
    const newLineType = ['title', 'image', 'list', 'divider'];
    // 对于这四种特殊的类型下一行肯定需要分行
    // 注：listNum 和 list 一样，都是 list 类型
    if (newLineType.includes(curr)) return '\n\n';
    return '';
  }

  protected __edit(type: TextType, curr: string) {
    this.document += this.__editBefore(this.preType, type);
    this.document += curr;
    this.document += this.__editAfter(this.preType, type);
    this.preType = type;
    return this;
  }
}
