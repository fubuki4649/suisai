import {withAxiosErrorHandling} from "../axios-error-handling.ts";
import {client} from "../client.ts";

// Unfile an asset (set its parent collection to none)
export async function unfileAsset(assetIds: string[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.post(`/management/asset/unfile`, {assetIds});
    return;
  })();
}

// Move an asset (set its parent collection to something else)
export async function reassignAsset(collectionId: string, assetIds: string[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.post(`/management/asset/reassign`, {collectionId, assetIds});
    return;
  })();
}

// Unfile a collection (move a collection along with its contents to root level)
export async function unfileCollection(collectionIds: string[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.post(`/management/collection/unfile`, {collectionIds});
    return;
  })();
}

// Move a collection (move a collection along with its contents to another collection)
export async function reassignCollection(parentId: string, collectionIds: string[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.post(`/management/collection/reassign`, {parentId, collectionIds});
    return;
  })();
}

// Backwards compatibility aliases
export const unfilePhoto = (photoIds: (string | number)[], onHttpError?: (code: number) => void) =>
  unfileAsset(photoIds.map(String), onHttpError);

export const movePhoto = (albumId: string | number, photoIds: (string | number)[], onHttpError?: (code: number) => void) =>
  reassignAsset(String(albumId), photoIds.map(String), onHttpError);

export const unfileAlbum = (albumIds: (string | number)[], onHttpError?: (code: number) => void) =>
  unfileCollection(albumIds.map(String), onHttpError);

export const moveAlbum = (parentId: string | number, albumIds: (string | number)[], onHttpError?: (code: number) => void) =>
  reassignCollection(String(parentId), albumIds.map(String), onHttpError);