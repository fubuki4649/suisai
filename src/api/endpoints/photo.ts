import {withAxiosErrorHandling} from "../axios-error-handling.ts";
import {client} from "../client.ts";
import {Asset} from "../models.ts";

export async function deleteAsset(assetIds: string[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.delete(`/asset/delete`, {data: {assetIds}});
    return;
  })();
}

export async function getAssets(assetIds: string[], onHttpError: (code: number) => void = () => {}): Promise<Asset[]> {
  return withAxiosErrorHandling<Asset[]>([], onHttpError, async (): Promise<Asset[]> => {
    return (await client.post<Asset[]>(`/asset/get`, {assetIds})).data;
  })();
}

// Backwards compatibility re-exports
export const deletePhoto = deleteAsset;