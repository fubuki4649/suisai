import {client} from "./client.ts";

/**
 * Checks if the Suisai backend server is online and responding.
 * Hits the `/meow` endpoint which returns HTTP 418 (I'm a teapot) when healthy.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await client.get("/meow", {
      validateStatus: () => true, // Accepts 418 or any HTTP status response from the backend
      timeout: 3500,
    });
    return typeof response.status === "number" && response.status > 0;
  } catch {
    return false;
  }
}
