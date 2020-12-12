import * as fs from 'fs';

type Creds = "email" | "stripe" | "paypal" | "slack";
export const creds = (path: Creds): Record<string, any> => {
    let result = {};
    try {
        const file = fs.readFileSync(`/opt/creds/${path}`);
        result = JSON.parse(file.toString());
    } catch (e) {
        console.log(e);
    }

    return result;
}; 