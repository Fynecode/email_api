import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const { sendMock } = vi.hoisted(() => ({
    sendMock: vi.fn()
}));

vi.mock("../../../../src/infrastructure/email/resend/email-sender.js", () => ({
    ResendEmailSender: class {
        send = sendMock;
    }
}));

import {createApp} from "../../../../src/app.js";
import type { EmailSender } from "../../../../src/domain/email/repositories/email-sender.js";

const app = createApp({ send: sendMock } as unknown as EmailSender);

describe("Email HTTP routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.API_KEY = "test-api-key";

        sendMock.mockResolvedValue({
            messageId: "test-message-id"
        });
    });

    it("should send an email with both text and html content", async () => {
        const response = await request(app)
            .post("/api/email")
            .set("x-api-key", "test-api-key")
            .send({
                from: "sender@example.com",
                to: "recipient@example.com",
                subject: "Integration test",
                body: "Plain text",
                html: "<h1>HTML content</h1>"
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            messageId: "test-message-id"
        });

        expect(sendMock).toHaveBeenCalledOnce();

        const email = sendMock.mock.calls[0][0];

        expect(email.body).toBe("Plain text");
        expect(email.html).toBe("<h1>HTML content</h1>");
    });

    it("should accept an email with only plain text", async () => {
        const response = await request(app)
            .post("/api/send")
            .set("x-api-key", "test-api-key")
            .send({
                from: "sender@example.com",
                to: "recipient@example.com",
                body: "Plain text only"
            });

        expect(response.status).toBe(200);

        const email = sendMock.mock.calls[0][0];

        expect(email.body).toBe("Plain text only");
        expect(email.html).toBeNull();
    });

    it("should accept an email with only html", async () => {
        const response = await request(app)
            .post("/api/email/send")
            .set("x-api-key", "test-api-key")
            .send({
                from: "sender@example.com",
                to: "recipient@example.com",
                html: "<h1>HTML only</h1>"
            });

        expect(response.status).toBe(200);

        const email = sendMock.mock.calls[0][0];

        expect(email.body).toBeNull();
        expect(email.html).toBe("<h1>HTML only</h1>");
    });

    it("should reject a request without body or html", async () => {
        const response = await request(app)
            .post("/api/email")
            .set("x-api-key", "test-api-key")
            .send({
                from: "sender@example.com",
                to: "recipient@example.com",
                subject: "Missing content"
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(sendMock).not.toHaveBeenCalled();
    });

    it("should reject a request with an invalid sender address", async () => {
        const response = await request(app)
            .post("/api/email")
            .set("x-api-key", "test-api-key")
            .send({
                from: "invalid-address",
                to: "recipient@example.com",
                body: "Test body"
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(sendMock).not.toHaveBeenCalled();
    });

    it("should reject a request without an API key", async () => {
        const response = await request(app)
            .post("/api/email")
            .send({
                from: "sender@example.com",
                to: "recipient@example.com",
                body: "Test body"
            });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            success: false,
            message: "Invalid API key."
        });

        expect(sendMock).not.toHaveBeenCalled();
    });
});