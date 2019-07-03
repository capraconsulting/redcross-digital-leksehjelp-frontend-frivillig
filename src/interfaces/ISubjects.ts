export interface ISubject {
  id: string;
  subject: string;
  themes: ITheme[];
}

export interface ITheme {
  theme: string;
  id: string;
}
