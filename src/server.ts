import "dotenv/config";

import { createApp } from "./app.js";
import { ResendEmailSender } from "./infrastructure/email/resend/email-sender.js";

const PORT = process.env.PORT || 3000;

const emailSender = new ResendEmailSender();
const app = createApp(emailSender);

app.listen(PORT, () => {
    console.log({
    port: PORT,
        resend: !!process.env.RESEND_API_KEY,
        apiKey: !!process.env.API_KEY
    });
});