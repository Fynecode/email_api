import express from "express";
import cors from "cors";
import helmet from "helmet";

import { createEmailRoutes } from "./presentation/http/routes/email-routes.js";
import { EmailController } from "./presentation/http/controllers/email-controller.js";

import { SendEmail } from "./application/email/use-cases/send-email-use-case.js";

import { errorHandler } from "./presentation/http/middleware/error-handler.js";

import { ResendEmailSender } from "./infrastructure/email/resend/email-sender.js";


// Infrastructure
const emailSender = new ResendEmailSender();


// Application
const sendEmail = new SendEmail(
    emailSender
);


// Presentation
const emailController = new EmailController(
    sendEmail
);


const app = express();


app.use(
    helmet()
);


app.use(
    cors()
);


app.use(
    express.json()
);


app.use(
    "/api",
    createEmailRoutes(emailController)
);


app.use(
    errorHandler
);


export default app;