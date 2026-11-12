import { z } from "zod";

export const sendEmailSchema = z.object({

    from: z.string()
        .min(1, "Sender email is required"),

    to: z.string()
        .min(1, "Recipient email is required"),

    subject: z.string()
        .optional(),

    body: z.string()
        .optional(),

    html: z.string()
        .optional()

}).refine(
    data => Boolean(data.body?.trim() || data.html?.trim()),
    {
        message: "Either body or html must be provided.",
        path: ["body"]
    }
);


export type SendEmailRequestSchema =
    z.infer<typeof sendEmailSchema>;