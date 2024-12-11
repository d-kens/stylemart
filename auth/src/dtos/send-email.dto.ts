import { Address } from "nodemailer/lib/mailer"

export class SendMailDto {
    from?: Address;
    recepients: Address[];
    subject: string;
    html: string;
    text?: string;
    placeHolderReplacements?: Record<string, string>
}