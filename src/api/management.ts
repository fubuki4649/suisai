import {withAxiosErrorHandling} from "./error-handling.ts";
import {client} from "./client.ts";

// Unfile an asset (set its parent collection to none)
export async function unfileAsset(assetIds: string[], onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.post(`/management/asset/unfile`, {assetIds});
  })();
}

// Move an asset (set its parent collection to something else)
export async function reassignAsset(collectionId: string, assetIds: string[], onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.post(`/management/asset/reassign`, {collectionId, assetIds});
  })();
}

// Unfile a collection (move a collection along with its contents to root level)
export async function unfileCollection(collectionIds: string[], onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.post(`/management/collection/unfile`, {collectionIds});
  })();
}

// Move a collection (move a collection along with its contents to another collection)
export async function reassignCollection(parentId: string, collectionIds: string[], onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.post(`/management/collection/reassign`, {parentId, collectionIds});
  })();
}
