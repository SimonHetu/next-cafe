export type ActionState<T = null> = {
  success: boolean | null;
  message?: string;
  error?: string;
  data?: T;
};