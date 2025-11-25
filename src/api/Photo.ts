import {withAxiosErrorHandling} from "./AxiosErrorHandling.ts";
import {client} from "./client.ts";

export async function deletePhoto(photoIds: number[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.delete(`/photo/delete`, {data: {photoIds: photoIds}});
    return;

  })();
}