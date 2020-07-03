import * as crypto from 'crypto';
import {promisify} from 'util';

const iterations = 10000;
const digest = "sha256";
const length = 256;
const encoding = 'hex';

const pbkdf2Async = promisify(crypto.pbkdf2);

const generate = async (password: string) => {
    const salt = crypto.randomBytes(128).toString('base64');
    const hash = (await pbkdf2Async(password, salt, iterations, length, digest)).toString(encoding);

    return ({salt, hash});
};

const validate = async (password: string, attempt: string, salt: string) => {
    const result = await pbkdf2Async(attempt, salt, iterations, length, digest);

    return result.toString(encoding) === password;
};

const pbkdf2 = {generate, validate};
export {pbkdf2};