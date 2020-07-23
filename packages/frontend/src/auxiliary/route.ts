const endpoint = "graphql";
const basePort = 8000;
const environment = process.env.RAZZLE_APP_ENV || 'development';
const baseDomain = 'truecostd2.store';
const [protocol, server, client] = environment === "production"
    ? ['https', `api.${baseDomain}`, `${baseDomain}`]
    : ['http', 'localhost:7000', 'localhost:8000'];

const clientUri = `${protocol}://${client}`;
const serverUri = `${protocol}://${server}`;
const serverEndpoint = `${serverUri}/${endpoint}`;

export {
    basePort,
    environment,
    clientUri,
    serverUri,
    serverEndpoint,
};
