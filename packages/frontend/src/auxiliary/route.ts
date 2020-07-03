const endpoint = "graphql";
const baseGame = process.env.RAZZLE_APP_GAME;
const basePort = process.env.RAZZLE_APP_PORT || "8000";
const environment = process.env.RAZZLE_APP_ENV || 'development';
const baseDomain = 'truecost.gg';
const [protocol, domain] = environment === "production" ? ['https', `${baseGame}.api.${baseDomain}`] : ['http', 'localhost:7000'];

const baseUri = `${protocol}://${domain}`;
const backendUri = `${baseUri}/${endpoint}`;
const imageUri = (path: string, id: string, name: string = "default") => `${baseUri}/${baseGame}/images/${path}/${id}/${name}`;

const games = [{
    disabled: false,
    url: "https://truecost.gg",
    name: "TrueCost",
    key: "main",
    twitter: null,
}, {
    disabled: false,
    url: "https://d2.truecost.gg",
    name: "Destiny 2",
    key: "d2",
    twitter: "destinythegame",
}, {
    disabled: false,
    url: "https://fortnite.truecost.gg",
    name: "Fortnite",
    key: "fortnite",
    twitter: "FortniteGame",
}, {
    disabled: false,
    url: "https://apex.truecost.gg",
    name: "Apex",
    key: "apex",
    twitter: "PlayApex",
}, {
    disabled: false,
    url: "https://cod.truecost.gg",
    name: "COD Warzone",
    key: "cod",
    twitter: "BattleRoyaleCoD",
}, {
    disabled: true,
    url: "https://playground.truecost.gg",
    name: "Playground",
    key: "playground",
    twitter: "destinythegame",
}];

const currentGame = games.filter(g => g.key === baseGame)[0];
games.pop();

console.log("backend uri: ", backendUri);
export {
    games,
    currentGame,
    environment,
    baseUri,
    basePort,
    baseGame,
    imageUri,
    backendUri,
};
