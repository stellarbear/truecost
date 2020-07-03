const generateCaptcha = () => {
    const numbers = [...new Array(10).keys()].map(key => '' + key);
    const lowercase = [...new Array(26).keys()].map(key => String.fromCharCode("a".charCodeAt(0) + key));
    const uppercase = [...new Array(26).keys()].map(key => String.fromCharCode("A".charCodeAt(0) + key));
    const alphabet = [...numbers, ...lowercase, ...uppercase];

    return [...new Array(6).keys()].reduce((acc, cur) => acc + alphabet[(Math.random() * alphabet.length) ^ 0], "");
};

export {generateCaptcha};
