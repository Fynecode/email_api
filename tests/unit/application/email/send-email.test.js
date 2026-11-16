import { describe, it, expect, beforeEach } from "vitest";
import { SendEmail } from "../../../../src/application/email/use-cases/send-email-use-case.js";
import { EmailSendFailedError } from "../../../../src/application/email/errors/email-send-failed.js";
class FakeEmailSender {
    sentEmails = [];
    shouldFail = false;
    async send(email) {
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
    let sender;
    let sendEmail;
    const baseRequest = {
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test email"
    };
    beforeEach(() => {
        sender = new FakeEmailSender();
        sendEmail = new SendEmail(sender);
    });
    it("should send an email with both body and html", async () => {
        const request = {
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
        const request = {
            ...baseRequest,
            body: "Hello!"
        };
        await sendEmail.execute(request);
        expect(sender.sentEmails).toHaveLength(1);
        expect(sender.sentEmails[0]?.body).toBe("Hello!");
        expect(sender.sentEmails[0]?.html).toBeNull();
    });
    it("should send an email with html only", async () => {
        const request = {
            ...baseRequest,
            html: "<h1>Hello!</h1>"
        };
        await sendEmail.execute(request);
        expect(sender.sentEmails).toHaveLength(1);
        expect(sender.sentEmails[0]?.body).toBeNull();
        expect(sender.sentEmails[0]?.html).toBe("<h1>Hello!</h1>");
    });
    it("should pass attachments to the email sender", async () => {
        const request = {
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
        const request = {
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
        const request = {
            ...baseRequest,
            body: "Hello!"
        };
        await expect(sendEmail.execute(request)).rejects.toThrow(EmailSendFailedError);
    });
});
//# sourceMappingURL=send-email.test.js.map