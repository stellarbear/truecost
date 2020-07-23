import * as nodemailer from 'nodemailer'
import * as fs from 'fs'
import {creds} from '../helpers/creds';
import {assert} from '../helpers/assert';
import * as mjml2html from 'mjml';

interface IProps {
    to: string
    subject: string
    text?: any
    template: string
}

export const composeEmail = async ({to, subject, text, template}: IProps) => {
    const {html} = mjml2html(template);

    let data = creds("email");
    console.log('--------------------------------------------', data);
    assert(data.email || data.pass, "email creds corrupted")

    console.log('initiating transport')
    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: data.email,
            pass: data.pass
        },
    });

    console.log('sending email');
    const info = await transport.sendMail({
        to,
        from: data.email,
        text,
        html,
        subject,
    });

    console.log("message sent: ", info);
}
