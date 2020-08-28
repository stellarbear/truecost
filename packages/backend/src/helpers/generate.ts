const numbers = "0123456789";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface IGenerate {
    length?: number;
    num?: boolean;
    lower?: boolean;
    upper?: boolean;
}

export const generateString = ({
                                   length = 8,
                                   num = true,
                                   lower = true,
                                   upper = true,
                               }: IGenerate) => {
    const alphabet = (num ? numbers : '') +
        (lower ? lowercase : '') +
        (upper ? uppercase : '');

    let result = '';

    for (let i = 0; i < length; i++) {
        const index = Math.round(Math.random() * (alphabet.length - 1));
        result += alphabet[index];
    }

    return result;
};
