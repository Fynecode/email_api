import { EmailAddress } from "../value-objects/email-address.js";
import { Attachment } from "../value-objects/attachment.js";

export class Email {

    constructor(
        public readonly from: EmailAddress,
        public readonly to: EmailAddress,
        public readonly body: string,
        public readonly subject: string,
        public readonly attachments: Attachment[] = []
    ) {
        this.validateBody();
    }

    private validateBody() {
        if (!this.body.trim()) {
            throw new Error("Email body cannot be empty");
        }
    }
}