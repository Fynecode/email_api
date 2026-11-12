import { EmailAddress } from "../value-objects/email-address.js";
import { Attachment } from "../value-objects/attachment.js";
import { InvalidEmailContentError } from "../errors/invalid-email-content-error.js";

export class Email {

    constructor(
        public readonly from: EmailAddress,
        public readonly to: EmailAddress,
        public readonly subject: string,
        public readonly body: string,
        public readonly html: string,
        public readonly attachments: Attachment[] = []
    ) {
        this.validateContent();
    }

    private validateContent(): void {
        if (
            !this.body?.trim() &&
            !this.html?.trim()
        ) {
            throw new InvalidEmailContentError();
        }
    }
}