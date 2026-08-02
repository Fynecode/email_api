import type { Request, Response, NextFunction } from "express";

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

            const request = req.body as SendEmailRequest;

            const result = await this.sendEmail.execute(request);


            res.status(200).json(result);


        } catch(error) {

            next(error);

        }

    }

}