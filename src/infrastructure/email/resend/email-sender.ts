import { resend } from "../resend-client.js";
import type { CreateEmailOptions } from "resend";

import type { EmailSender } from "../../../domain/email/repositories/email-sender.js";

import type { Email } from "../../../domain/email/entities/email.js";
import { EmailSendFailedError } from "../../../application/email/errors/email-send-failed.js";

import { InvalidEmailContentError } from "../../../domain/email/errors/invalid-email-content-error.js";

function buildResendPayload(email: Email): CreateEmailOptions {
    const base = {
        from: email.from.getValue(),
        to: email.to.getValue(),
        subject: email.subject,
        ...(email.attachments.length > 0 && {
            attachments: email.attachments.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content
            }))
        })
    };

    const hasHtml = Boolean(email.html?.trim());
    const hasText = Boolean(email.body?.trim());

    if (hasHtml && hasText) {
        return {
            ...base,
            html: email.html!,
            text: email.body!
        };
    }

    if (hasHtml) {
        return {
            ...base,
            html: email.html!
        };
    }

    if (hasText) {
        return {
            ...base,
            text: email.body!
        };
    }

    throw new InvalidEmailContentError();
}

export class ResendEmailSender implements EmailSender {
    async send(email: Email): Promise<{ messageId: string }> {
        const payload = buildResendPayload(email);

        const response = await resend.emails.send(payload);

        if (response.error) {
            throw new EmailSendFailedError(response.error.message);
        }

        return {
            messageId: response.data.id
        };
    }
}