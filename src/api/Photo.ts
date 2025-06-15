import {withAxiosErrorHandling} from "./AxiosErrorHandling.ts";
import axios from "axios";

export async function deletePhoto(photoIds: number[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await axios.delete(`http://localhost:8000/api/photo/delete`, {data: {photoIds: photoIds}});
    return;

  })();
}