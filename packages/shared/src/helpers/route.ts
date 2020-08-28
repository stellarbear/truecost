export const getRoutes = (environment = 'development') => {
    const domain = 'truecost.gg';
    const endpoint = "graphql";
    const clientPort = 8000;
    const serverPort = 7000;

    const [protocol, server, client] = environment === "production"
        ? ['https', `api.${domain}`, `${domain}`]
        : ['http', `localhost:${serverPort}`, `localhost:${clientPort}`];

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
