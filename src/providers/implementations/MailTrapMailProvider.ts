import Mail from "nodemailer/lib/mailer";
import { IMailProvider, IMessage } from "../IMailProvider";
import nodemailer from 'nodemailer';

export class MailTrappMailProvider implements IMailProvider {
  private readonly transporter: Mail;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "e9446bc2edaec7",
        pass: "989bb0701dc50d"
      }
    })
    
  }
    async sendMail(message: IMessage): Promise<void> {
    const { to, from, subject, body } = message;

    await this.transporter.sendMail({
        to: {
            name: to.name,
            address: to.email
        },
        from: {
            name: from.name,
            address: from.email
        },
        subject,
        html: body
    })
  }
}