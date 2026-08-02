import { AttachmentError } from "./attachment-error.js";

export class AttachmentTooLargeError extends AttachmentError {
    constructor(maxSize: number) {
        super(`Attachment exceeds the maximum allowed size of ${maxSize} bytes.`);
    }
}