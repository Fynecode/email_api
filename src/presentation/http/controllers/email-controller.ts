import type { Request, Response, NextFunction } from "express";

import { Attachment } from "../../../domain/email/value-objects/attachment.js";

import { SendEmail } from "../../../application/email/use-cases/send-email-use-case.js";
import type { SendEmailRequest } from "../../../application/email/dto/send-email-request.js";


export class EmailController {

    constructor(
        private readonly sendEmail: SendEmail
    ) {}

    async send(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const files = ((req.files as Express.Multer.File[]) ?? []).map(
                file =>
                    new Attachment(
                        file.originalname,
                        file.buffer,
                        file.mimetype
                    )
            );

            const request: SendEmailRequest = {
                ...req.body,
                attachments: files
            };

            const result = await this.sendEmail.execute(request);

            res.status(200).json(result);

        } catch (error) {

            next(error);

        }

    }

}