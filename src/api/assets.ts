import {withAxiosErrorHandling} from "./error-handling.ts";
import {client} from "./client.ts";
import {Asset} from "../types/models.ts";

export async function deleteAsset(assetIds: string[], onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.delete(`/asset/delete`, {data: {assetIds}});
  })();
}

export async function getAssets(assetIds: string[], onHttpError: (code: number) => void = () => undefined): Promise<Asset[]> {
  return withAxiosErrorHandling<Asset[]>([], onHttpError, async (): Promise<Asset[]> => {
    return (await client.post<Asset[]>(`/asset/get`, {assetIds})).data;
  })();
}
