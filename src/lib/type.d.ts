export type ActionState<T = null> = {
  success: boolean | null;
  message?: string;
  error?: Error;
  data?: T;
};
