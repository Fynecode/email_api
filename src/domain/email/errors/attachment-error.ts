import { EmailError } from "./email-error.js";

export abstract class AttachmentError extends EmailError {
    constructor(message: string) {
        super(message);
    }
}