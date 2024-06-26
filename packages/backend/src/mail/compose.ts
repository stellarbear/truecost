import * as nodemailer from 'nodemailer';
import {creds} from '../helpers/creds';
import {assert} from '../helpers/assert';
import * as mjml2html from 'mjml';

interface IProps {
    to: string;
    subject: string;
    text?: any;
    template: string;
}

export const composeEmail = async ({to, subject, text, template}: IProps) => {
    const {html} = mjml2html(template);

    const data = creds("email");
    assert(data.email || data.pass, "email creds corrupted");
    console.log('creds parsed');

    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: data.email,
            pass: data.pass,
        },
    });
    console.log('transport created', data.email, to);

    const info = await transport.sendMail({
        to,
        from: data.email,
        text,
        html,
        subject,
    });

    console.log('email sent', info);
};
