export interface IBook {
  title: string;
  authorName: string;
  publishYear: number;
  pages: number;
}

export class Book implements IBook {
  title: string;
  authorName: string;
  publishYear: number;
  pages: number;

  constructor(
    _title: string,
    _authorName: string,
    _publishYear: number,
    _pages: number
  ) {
    (this.title = _title),
      (this.authorName = _authorName),
      (this.publishYear = _publishYear),
      (this.pages = _pages);
  }
}
