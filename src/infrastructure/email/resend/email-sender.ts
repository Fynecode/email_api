import { resend } from "../resend-client.js";
import type { CreateEmailOptions } from "resend";

import type { EmailSender } from "../../../domain/email/repositories/email-sender.js";

import type { Email } from "../../../domain/email/entities/email.js";
import { EmailSendFailedError } from "../../../application/email/errors/email-send-failed.js";


export class ResendEmailSender implements EmailSender {


    async send(
    email: Email
): Promise<{ messageId: string }> {

    const payload: CreateEmailOptions = {
        from: email.from.getValue(),
        to: email.to.getValue(),
         subject: email.subject,
        html: email.body,
        text: email.body
    };


    if (email.subject) {
        payload.subject = email.subject;
    }


    if (email.attachments.length > 0) {
        payload.attachments = email.attachments.map(
            attachment => ({
                filename: attachment.filename,
                content: attachment.content
            })
        );
    }


    const response = await resend.emails.send(payload);


    if (response.error) {
        throw new EmailSendFailedError(
            response.error.message
        );
    }


    return {
        messageId: response.data.id
    };

}

}