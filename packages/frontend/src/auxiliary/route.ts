const endpoint = "graphql";
const basePort = 8000;
const environment = process.env.RAZZLE_APP_ENV || 'development';
const baseDomain = 'truecost.gg';
const [protocol, domain] = environment === "production" ? ['https', `api.${baseDomain}`] : ['http', 'localhost:7000'];

const baseUri = `${protocol}://${domain}`;
const backendUri = `${baseUri}/${endpoint}`;

export {
    environment,
    baseUri,
    basePort,
    backendUri,
};
