import { AttachmentError } from "./attachment-error.js";

export class AttachmentMissingFilenameError extends AttachmentError {
    constructor() {
        super("Attachment filename is required.");
    }
}