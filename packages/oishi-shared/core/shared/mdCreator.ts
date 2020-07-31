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

const blockArr = ['title', 'list', 'line', 'divider', 'image'];

interface ITextInterface {
  type: TextType;
  text: string;

  pre?: ITextInterface | null;
  next?: ITextInterface | null;

  preRender: (currText: ITextInterface) => string;
  nextRender: (currText: ITextInterface) => string;
}

export default class MdCreator {
  static create(document?: string) {
    return new MdCreator(document);
  }

  protected base: string;
  protected head: ITextInterface;
  protected curr: ITextInterface;

  constructor(document = '') {
    this.base = document;

    this.head = {
      type: '',
      text: '',
      pre: null,
      next: null,
      preRender: () => '',
      nextRender: () => '',
    };

    this.curr = this.head;
  }

  text(text: Text) {
    const preRender = (currText: ITextInterface) => '';
    const nextRender = (currText: ITextInterface) => {
      if (currText.next?.type === 'text') return '  \n';
      if (currText.next?.type === 'quote') return '\n\n';
      return '';
    };

    return this.next({
      type: 'text',
      text: `${text}`,
      preRender,
      nextRender,
    });
  }

  title(deep: 1 | 2 | 3 | 4 | 5 | 6, text: Text) {
    const preRender = (currText: ITextInterface) => '\n\n';
    const nextRender = (currText: ITextInterface) => {
      if (blockArr.includes(currText.next?.type || '')) return '';
      return '\n\n';
    };

    return this.next({
      type: 'title',
      text: `${new Array(deep).fill('#').join('')} ${text}`,
      preRender,
      nextRender,
    });
  }

  quote(text: Text) {
    const preRender = (currText: ITextInterface) => '';
    const nextRender = (currText: ITextInterface) => {
      if (currText.next?.type === 'text') return '\n\n';
      if (currText.next?.type === 'quote') return '  \n';
      return '';
    };

    return this.next({
      type: 'quote',
      text: `> ${text}`,
      preRender,
      nextRender,
    });
  }

  link(url: string, placeholder?: Text) {
    const preRender = (currText: ITextInterface) => '';
    const nextRender = (currText: ITextInterface) => '';

    return this.next({
      type: 'link',
      text: `[${placeholder || ''}](${url})`,
      preRender,
      nextRender,
    });
  }

  image(imageUrl: string, placeholder?: Text) {
    const preRender = (currText: ITextInterface) => '\n\n';
    const nextRender = (currText: ITextInterface) => {
      if (blockArr.includes(currText.next?.type || '')) return '';
      return '\n\n';
    };

    return this.next({
      type: 'image',
      text: `![${placeholder || ''}](${imageUrl})`,
      preRender,
      nextRender,
    });
  }

  list(arr: Text[]) {
    const preRender = (currText: ITextInterface) => '\n\n';
    const nextRender = (currText: ITextInterface) => {
      if (blockArr.includes(currText.next?.type || '')) return '';
      return '\n\n';
    };

    const curr = arr.reduce(
      (pre, curr, index) =>
        index === arr.length - 1 ? `${pre}- ${curr}` : `${pre}- ${curr}\n`,
      '',
    );

    return this.next({
      type: 'list',
      text: `${curr}`,
      preRender,
      nextRender,
    });
  }

  listNum(arr: Text[]) {
    const preRender = (currText: ITextInterface) => '\n\n';
    const nextRender = (currText: ITextInterface) => {
      if (blockArr.includes(currText.next?.type || '')) return '';
      return '\n\n';
    };

    const curr = arr.reduce(
      (pre, curr, index) =>
        index === arr.length - 1
          ? `${pre}${index + 1}. ${curr}`
          : `${pre}${index + 1}. ${curr}\n`,
      '',
    );
    return this.next({
      type: 'list',
      text: `${curr}`,
      preRender,
      nextRender,
    });
  }

  divider() {
    const preRender = (currText: ITextInterface) => '\n\n';
    const nextRender = (currText: ITextInterface) => {
      if (blockArr.includes(currText.next?.type || '')) return '';
      return '\n\n';
    };

    return this.next({
      type: 'divider',
      text: `---`,
      preRender,
      nextRender,
    });
  }

  line() {
    const preRender = (currText: ITextInterface) => {
      if (blockArr.includes(currText.next?.type || '')) return '';
      return '\n';
    };
    const nextRender = (currText: ITextInterface) => {
      if (blockArr.includes(currText.next?.type || '')) return '';
      return '\n';
    };

    return this.next({
      type: 'line',
      text: ``,
      preRender,
      nextRender,
    });
  }

  output() {
    let next = this.head;
    let document = this.base;

    while (next.next) {
      document += next.preRender(next);
      document += next.text;
      document += next.nextRender(next);

      next = next.next;
    }

    // 上面的 next.next 判断，正好把最后一个给排除了
    // 正好，指针 curr 指着最后一个，那就再执行一次 curr 的逻辑就好了
    document += this.curr.preRender(this.curr);
    document += this.curr.text;
    document += this.curr.nextRender(this.curr);

    return document;
  }

  protected next(obj: ITextInterface) {
    obj.pre = this.curr;
    obj.next = null;

    this.curr.next = obj;
    this.curr = obj;
    return this;
  }
}
