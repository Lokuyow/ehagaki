import type { UploadProtocol, UploadProtocolAdapter } from "../types";
import { BlossomUploadAdapter } from "./BlossomUploadAdapter";
import { CustomHttpUploadAdapter } from "./CustomHttpUploadAdapter";
import { Nip96UploadAdapter } from "./Nip96UploadAdapter";

const adapters: Record<UploadProtocol, UploadProtocolAdapter> = {
    blossom: new BlossomUploadAdapter(),
    nip96: new Nip96UploadAdapter(),
    "custom-http": new CustomHttpUploadAdapter(),
};

export function getUploadAdapter(protocol: UploadProtocol): UploadProtocolAdapter {
    return adapters[protocol];
}
