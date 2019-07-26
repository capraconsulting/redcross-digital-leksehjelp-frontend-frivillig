export interface ISubject {
  id: number;
  subjectTitle: string;
  themes: ITheme[];
}

export interface ITheme {
  theme: string;
  id: string;
}
