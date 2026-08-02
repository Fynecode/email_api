import { AttachmentError } from "./attachment-error.js";

export class AttachmentExtensionNotAllowedError extends AttachmentError {
    constructor(extension: string) {
        super(`Files with extension '${extension}' are not allowed.`);
    }
}