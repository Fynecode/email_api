import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";
class FakeEmailSender {
    sentEmails = [];
    shouldFail = false;
    async send(email) {
        if (this.shouldFail) {
            throw new Error("Simulated email sending failure.");
        }
        this.sentEmails.push(email);
        return {
            messageId: "e2e-message-id"
        };
    }
}
describe("Email API E2E", () => {
    let sender;
    let app;
    beforeEach(() => {
        process.env.API_KEY = "e2e-test-api-key";
        sender = new FakeEmailSender();
        app = createApp(sender);
    });
    it("should send an email containing both text and html", async () => {
        const response = await request(app)
            .post("/api/email")
            .set("x-api-key", "e2e-test-api-key")
            .send({
            from: "sender@example.com",
            to: "recipient@example.com",
            subject: "E2E test",
            body: "Plain text content",
            html: "<h1>HTML content</h1>"
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            messageId: "e2e-message-id"
        });
        expect(sender.sentEmails).toHaveLength(1);
        expect(sender.sentEmails[0].body).toBe("Plain text content");
        expect(sender.sentEmails[0].html).toBe("<h1>HTML content</h1>");
    });
    it("should send an HTML-only email", async () => {
        const response = await request(app)
            .post("/api/send")
            .set("x-api-key", "e2e-test-api-key")
            .send({
            from: "sender@example.com",
            to: "recipient@example.com",
            html: "<h1>Hello</h1>"
        });
        expect(response.status).toBe(200);
        expect(sender.sentEmails).toHaveLength(1);
        expect(sender.sentEmails[0].body).toBeNull();
        expect(sender.sentEmails[0].html).toBe("<h1>Hello</h1>");
    });
    it("should reject requests without an API key", async () => {
        const response = await request(app)
            .post("/api/email")
            .send({
            from: "sender@example.com",
            to: "recipient@example.com",
            body: "Test content"
        });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            success: false,
            message: "Invalid API key."
        });
        expect(sender.sentEmails).toHaveLength(0);
    });
    it("should reject requests without email content", async () => {
        const response = await request(app)
            .post("/api/email")
            .set("x-api-key", "e2e-test-api-key")
            .send({
            from: "sender@example.com",
            to: "recipient@example.com"
        });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(sender.sentEmails).toHaveLength(0);
    });
    it("should reject invalid email addresses", async () => {
        const response = await request(app)
            .post("/api/email")
            .set("x-api-key", "e2e-test-api-key")
            .send({
            from: "invalid-address",
            to: "recipient@example.com",
            body: "Test content"
        });
        expect(response.status).toBe(400);
        expect(sender.sentEmails).toHaveLength(0);
    });
    it("should process multipart requests with attachments", async () => {
        const response = await request(app)
            .post("/api/email")
            .set("x-api-key", "e2e-test-api-key")
            .field("from", "sender@example.com")
            .field("to", "recipient@example.com")
            .field("subject", "Attachment test")
            .field("body", "Please see the attachment.")
            .attach("attachments", Buffer.from("Test file content"), {
            filename: "test.txt",
            contentType: "text/plain"
        });
        expect(response.status).toBe(200);
        expect(sender.sentEmails).toHaveLength(1);
        const email = sender.sentEmails[0];
        expect(email.attachments).toHaveLength(1);
        expect(email.attachments[0].filename).toBe("test.txt");
        expect(email.attachments[0].content.toString()).toBe("Test file content");
    });
    it("should return an error when email sending fails", async () => {
        sender.shouldFail = true;
        const response = await request(app)
            .post("/api/email")
            .set("x-api-key", "e2e-test-api-key")
            .send({
            from: "sender@example.com",
            to: "recipient@example.com",
            body: "Test content"
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            success: false,
            message: "Failed to send email."
        });
    });
});
//# sourceMappingURL=email-api.test.js.map