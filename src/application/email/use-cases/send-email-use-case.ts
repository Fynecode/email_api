import { Email } from "../../../domain/email/entities/email.js";
import { Attachment } from "../../../domain/email/value-objects/attachment.js";
import { EmailAddress } from "../../../domain/email/value-objects/email-address.js";
import { type EmailSender } from "../../../domain/email/repositories/email-sender.js";

import { type SendEmailRequest } from "../dto/send-email-request.js";
import { type SendEmailResponse } from "../dto/send-email-response.js";
import { EmailSendFailedError } from "../errors/email-send-failed.js";

export class SendEmail {

    constructor(
        private readonly sender: EmailSender
    ) {}

    async execute(
        request: SendEmailRequest
    ): Promise<SendEmailResponse> {
        const from = new EmailAddress(request.from);

        const to = new EmailAddress(request.to);

        const attachments = request.attachments?.map(
            attachment =>
                new Attachment(
                    attachment.filename,
                    attachment.content,
                    attachment.mimeType
                )
        ) ?? [];

        const email = new Email(
            from,
            to,
            request.body,
            request.subject,
            attachments
        );

        try {

            const result = await this.sender.send(email);

            return {
                success: true,
                messageId: result.messageId
            };
        }
        catch (error) {

            throw new EmailSendFailedError();

        }
    }

}