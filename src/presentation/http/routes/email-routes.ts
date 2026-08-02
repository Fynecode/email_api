import { Router } from "express";

import { EmailController } from "../controllers/email-controller.js";
import { sendEmailSchema } from "../validators/email-request-validator.js";
import { validateRequest } from "../validators/validate-request.js";
import { apiKeyMiddleware } from "../middleware/api-key.js";
import { emailRateLimiter } from "../middleware/rate-limit.js";
import { upload } from "../middleware/upload.js";


export function createEmailRoutes(
    controller: EmailController
) {

    const router = Router();


    router.post(
        "/email",

        apiKeyMiddleware,

        emailRateLimiter,

        upload.array("attachments", 5),

        validateRequest(sendEmailSchema),

        controller.send.bind(controller)
    );

    return router;
}