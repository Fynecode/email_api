import { EmailError } from "./email-error.js";

export class InvalidEmailError extends EmailError {
    constructor(email: string) {
        super(`'${email}' is not a valid email address.`);
    }
}