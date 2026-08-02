import { Email } from "../entities/email.js";

export interface EmailSender {

    send(email: Email): Promise<{
        messageId: string;
    }>;

}