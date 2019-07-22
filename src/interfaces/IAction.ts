export interface IAction {
  type: string;
  payload;
  meta?;
  error?: Error;
}
