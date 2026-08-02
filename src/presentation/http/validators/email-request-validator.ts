import { z } from "zod";


export const sendEmailSchema = z.object({

    from: z.string()
        .min(1, "Sender email is required"),

    to: z.string()
        .min(1, "Recipient email is required"),

    subject: z.string()
        .optional(),

    body: z.string()
        .min(1, "Email body is required")

});


export type SendEmailRequestSchema =
    z.infer<typeof sendEmailSchema>;