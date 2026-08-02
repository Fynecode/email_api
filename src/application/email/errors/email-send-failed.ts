import { ApplicationError } from "./application-error.js";

export class EmailSendFailedError extends ApplicationError {
    constructor(reason?: string) {
        super(reason ?? "Failed to send email.");
    }
}