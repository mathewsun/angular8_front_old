export interface ApiResult<T = any> {
  success: boolean;
  message: string;
  body: T;
  errorCode: number;
}
