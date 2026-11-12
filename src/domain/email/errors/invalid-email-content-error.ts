import { EmailError } from "./email-error.js";

export class InvalidEmailContentError extends EmailError {
    constructor() {
        super("Email content cannot be empty. Either body or html must be provided.");
        this.name = "InvalidEmailContentError";
    }
}