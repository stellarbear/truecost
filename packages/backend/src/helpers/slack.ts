import * as request from "request";
import {creds} from './creds';

export const slack = (input: string | string[]) => {
    const data = creds("slack");
    const chats = Array.isArray(data) ? data : [data];

    try {
        for (const {a, b, c} of chats) {
            const slackUrl = `https://hooks.slack.com/services/${a}/${b}/${c}`;
            const pretext = Array.isArray(input) ? input : [input];
            const text = pretext.join("\n");

            request.post(
                {
                    url: slackUrl,
                    headers: {'Content-type': 'application/json'},
                    form: {payload: JSON.stringify({text})},
                },
            );
        }
        console.log("slack notified");
    } catch (e) {
        console.log(e);
    }
};
