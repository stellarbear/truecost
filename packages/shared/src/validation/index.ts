const regexRegistry = {
    // eslint-disable-next-line max-len
    //  https://stackoverflow.com/questions/10006459/regular-expression-for-ip-address-validation
    // eslint-disable-next-line max-len
    "ipv4": /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/,

    // eslint-disable-next-line max-len
    // https://stackoverflow.com/questions/10306690/what-is-a-regular-expression-which-will-match-a-valid-domain-name-without-a-subd
    // eslint-disable-next-line max-len
    "domain": /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,

    // eslint-disable-next-line max-len
    //  https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    // eslint-disable-next-line max-len
    "email": /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
};

const validate = (type: keyof typeof regexRegistry) => {
    return ({
        regex: regexRegistry[type],
        test: (input: string) => regexRegistry[type].test(input),
    });
};

export {validate};