import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface CreateMemoryArgs {
    media: ExternalBlob;
    title: string;
    contentType: ContentType;
    date: string;
    filename: string;
    story?: string;
    category?: Category;
}
export type Time = bigint;
export interface Memory {
    id: MemoryId;
    media: ExternalBlob;
    title: string;
    uploaderName: string;
    contentType: ContentType;
    date: string;
    filename: string;
    story?: string;
    category?: Category;
    uploader: Principal;
    uploadedAt: Time;
}
export interface UpdateMemoryArgs {
    id: MemoryId;
    title: string;
    date: string;
    story?: string;
    category?: Category;
}
export type MemoryId = bigint;
export type Category = string;
export enum ContentType {
    video = "video",
    image = "image"
}
export enum SortBy {
    date = "date",
    category = "category"
}
export interface backendInterface {
    createMemory(args: CreateMemoryArgs): Promise<MemoryId>;
    deleteMemory(id: MemoryId): Promise<boolean>;
    getMemory(id: MemoryId): Promise<Memory | null>;
    listMemories(sortBy: SortBy): Promise<Array<Memory>>;
    updateMemory(args: UpdateMemoryArgs): Promise<boolean>;
}
