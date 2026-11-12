
import { describe, it, expect, beforeEach  } from "vitest";

import { SendEmail } from "../../../../src/application/email/use-cases/send-email-use-case.js";
import { EmailSendFailedError } from "../../../../src/application/email/errors/email-send-failed.js";

import type { EmailSender } from "../../../../src/domain/email/repositories/email-sender.js";
import type { Email } from "../../../../src/domain/email/entities/email.js";

import type { SendEmailRequest } from "../../../../src/application/email/dto/send-email-request.js";

class FakeEmailSender implements EmailSender {

    public sentEmails: Email[] = [];

    public shouldFail = false;

    async send(email: Email): Promise<{ messageId: string }> {

        if (this.shouldFail) {
            throw new Error("Email sending failed");
        }

        this.sentEmails.push(email);

        return {
            messageId: "test-message-123"
        };

    }

}


describe("SendEmail Use Case", () => {

    let sender: FakeEmailSender;
    let sendEmail: SendEmail;

    const baseRequest: SendEmailRequest = {
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test email"
    };

    beforeEach(() => {
        sender = new FakeEmailSender();
        sendEmail = new SendEmail(sender);
    });


    it("should send an email with both body and html", async () => {

        const request: SendEmailRequest = {
            ...baseRequest,
            body: "Hello!",
            html: "<h1>Hello!</h1>"
        };

        await sendEmail.execute(request);

        expect(sender.sentEmails).toHaveLength(1);
        expect(sender.sentEmails[0]?.body).toBe("Hello!");
        expect(sender.sentEmails[0]?.html).toBe("<h1>Hello!</h1>");

    });


    it("should send an email with body only", async () => {

        const request: SendEmailRequest = {
            ...baseRequest,
            body: "Hello!"
        };

        await sendEmail.execute(request);

        expect(sender.sentEmails).toHaveLength(1);
        expect(sender.sentEmails[0]?.body).toBe("Hello!");
        expect(sender.sentEmails[0]?.html).toBeNull();

    });


    it("should send an email with html only", async () => {

        const request: SendEmailRequest = {
            ...baseRequest,
            html: "<h1>Hello!</h1>"
        };

        await sendEmail.execute(request);

        expect(sender.sentEmails).toHaveLength(1);
        expect(sender.sentEmails[0]?.body).toBeNull();
        expect(sender.sentEmails[0]?.html).toBe("<h1>Hello!</h1>");

    });


    it("should pass attachments to the email sender", async () => {

        const request: SendEmailRequest = {
            ...baseRequest,
            body: "See attached.",
            attachments: [
                {
                    filename: "document.pdf",
                    content: Buffer.from("test document"),
                    mimeType: "application/pdf"
                }
            ]
        };

        await sendEmail.execute(request);

        const sentEmail = sender.sentEmails[0];

        expect(sentEmail?.attachments).toHaveLength(1);
        expect(sentEmail?.attachments[0]?.filename).toBe("document.pdf");

    });


    it("should return the message ID after successful sending", async () => {

        const request: SendEmailRequest = {
            ...baseRequest,
            body: "Hello!"
        };

        const result = await sendEmail.execute(request);

        expect(result).toEqual({
            success: true,
            messageId: "test-message-123"
        });

    });


    it("should throw EmailSendFailedError when the sender fails", async () => {

        sender.shouldFail = true;

        const request: SendEmailRequest = {
            ...baseRequest,
            body: "Hello!"
        };

        await expect(
            sendEmail.execute(request)
        ).rejects.toThrow(EmailSendFailedError);

    });

});
