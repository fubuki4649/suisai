import axios from "axios";

export function withAxiosErrorHandling<T extends Exclude<unknown, void>>(
  fallback: T,
  onHttpError: (code: number) => void,
  fn: (...args: unknown[]) => Promise<T>
): (...args: unknown[]) => Promise<T> {
  return async (...args: unknown[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error: unknown) {
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
