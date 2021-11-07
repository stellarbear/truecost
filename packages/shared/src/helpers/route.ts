export const getRoutes = (environment = 'development') => {
    const domain = 'truecost.gg';
    const endpoint = "graphql";
    const clientPort = 8000;
    const serverPort = 7000;

    const dev = ['http', `localhost:${serverPort}`, `localhost:${clientPort}`];
    const prod = ['https', `api.${domain}`, `${domain}`];

    const [protocol, server, client] =
        (environment === "production" || process.env.RAZZLE_APP_REMOTE === "true")
            ? prod
            : dev;

    const frontend = {
        uri: `${protocol}://${client}`,
        port: clientPort,
    };

    
    const backend = {
        uri: `${protocol}://${server}`,
        port: serverPort,
        endpoint: `${protocol}://${server}/${endpoint}`,
    };
    
    return ({
        frontend, backend, environment, domain,
    });
};
