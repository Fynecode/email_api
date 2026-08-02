import { type AttachmentDTO } from './attachment.js';

export interface SendEmailRequest {

    from: string;

    to: string;

    subject?: string;

    body: string;

    attachments?: AttachmentDTO[];

}