import { describe, it, expect } from "vitest";

import { Email } from "../../../../src/domain/email/entities/email.js";
import { EmailAddress } from "../../../../src/domain/email/value-objects/email-address.js";
import { InvalidEmailContentError } from "../../../../src/domain/email/errors/invalid-email-content-error.js";

describe("Email Entity", () => {

    const from = new EmailAddress("sender@example.com");
    const to = new EmailAddress("recipient@example.com");

    const subject = "Test email";

    it("should accept an email with both body and html", () => {

        const email = new Email(
            from,
            to,
            subject,
            "Hello, this is a test.",
            "<h1>Hello, this is a test.</h1>"
        );

        expect(email.body).toBe("Hello, this is a test.");
        expect(email.html).toBe("<h1>Hello, this is a test.</h1>");

    });


    it("should accept an email with body and no html", () => {

        const email = new Email(
            from,
            to,
            subject,
            "Hello, this is a test.",
            undefined
        );

        expect(email.body).toBe("Hello, this is a test.");
        expect(email.html).toBeUndefined();

    });


    it("should accept an email with html and no body", () => {

        const email = new Email(
            from,
            to,
            subject,
            undefined,
            "<h1>Hello, this is a test.</h1>"
        );

        expect(email.body).toBeUndefined();
        expect(email.html).toBe("<h1>Hello, this is a test.</h1>");

    });


    it("should reject an email with neither body nor html", () => {

        expect(() => {
            new Email(
                from,
                to,
                subject,
                undefined,
                undefined
            );
        }).toThrow(InvalidEmailContentError);

    });

});
