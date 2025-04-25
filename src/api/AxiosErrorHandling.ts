import axios, {AxiosError} from "axios";


export function withAxiosErrorHandling<T extends Exclude<unknown, void>>(
  fallback: T,
  onHttpError: (code: number) => void,
  fn: (...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T> {
  return async (...args: any[]): Promise<T> => {

    // Run inner function
    try {
      return await fn(...args);
    } catch (error: AxiosError | unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("HTTP error", error.response.status);
          onHttpError(error.response.status);
          throw error;
        } else {
          console.error("Axios error", error.message);
        }
      } else {
        console.error("Unknown error", error);
      }

      return fallback;

    }
  };
}
