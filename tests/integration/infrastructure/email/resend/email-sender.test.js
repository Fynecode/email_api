import { beforeEach, describe, expect, it, vi } from "vitest";
const { sendMock } = vi.hoisted(() => ({
    sendMock: vi.fn()
}));
vi.mock("../../../../../src/infrastructure/email/resend-client.js", () => ({
    resend: {
        emails: {
            send: sendMock
        }
    }
}));
import { ResendEmailSender } from "../../../../../src/infrastructure/email/resend/email-sender.js";
import { Email } from "../../../../../src/domain/email/entities/email.js";
import { EmailAddress } from "../../../../../src/domain/email/value-objects/email-address.js";
import { Attachment } from "../../../../../src/domain/email/value-objects/attachment.js";
import { EmailSendFailedError } from "../../../../../src/application/email/errors/email-send-failed.js";
describe("ResendEmailSender", () => {
    let sender;
    const createEmail = (body, html, attachments = []) => new Email(new EmailAddress("sender@example.com"), new EmailAddress("recipient@example.com"), "Test subject", body, html, attachments);
    beforeEach(() => {
        vi.clearAllMocks();
        sender = new ResendEmailSender();
    });
    it("should send an email containing both text and html", async () => {
        sendMock.mockResolvedValue({
            data: { id: "email-123" },
            error: null
        });
        const email = createEmail("Plain text content", "<h1>HTML content</h1>");
        const result = await sender.send(email);
        expect(sendMock).toHaveBeenCalledWith({
            from: "sender@example.com",
            to: "recipient@example.com",
            subject: "Test subject",
            text: "Plain text content",
            html: "<h1>HTML content</h1>"
        });
        expect(result).toEqual({
            messageId: "email-123"
        });
    });
    it("should send an email containing only plain text", async () => {
        sendMock.mockResolvedValue({
            data: { id: "email-456" },
            error: null
        });
        const email = createEmail("Plain text content", null);
        await sender.send(email);
        expect(sendMock).toHaveBeenCalledWith({
            from: "sender@example.com",
            to: "recipient@example.com",
            subject: "Test subject",
            text: "Plain text content"
        });
    });
    it("should send an email containing only html", async () => {
        sendMock.mockResolvedValue({
            data: { id: "email-789" },
            error: null
        });
        const email = createEmail(null, "<h1>HTML content</h1>");
        await sender.send(email);
        expect(sendMock).toHaveBeenCalledWith({
            from: "sender@example.com",
            to: "recipient@example.com",
            subject: "Test subject",
            html: "<h1>HTML content</h1>"
        });
    });
    it("should include attachments in the Resend payload", async () => {
        sendMock.mockResolvedValue({
            data: { id: "email-attachment" },
            error: null
        });
        const attachment = new Attachment("document.txt", Buffer.from("Test attachment"), "text/plain");
        const email = createEmail("Email with attachment", null, [attachment]);
        await sender.send(email);
        expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
            text: "Email with attachment",
            attachments: [
                {
                    filename: "document.txt",
                    content: attachment.content
                }
            ]
        }));
    });
    it("should throw EmailSendFailedError when Resend returns an error", async () => {
        sendMock.mockResolvedValue({
            data: null,
            error: {
                message: "Resend API failure"
            }
        });
        const email = createEmail("Test body", null);
        await expect(sender.send(email)).rejects.toBeInstanceOf(EmailSendFailedError);
    });
});
//# sourceMappingURL=email-sender.test.js.map