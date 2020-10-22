import {CLink} from "components/generic/types";

const link = new CLink({
    key: "game",
    label: "game",
    query: {name: "GameAll"},
    multiple: false,
    readOnly: false,
});

const fields = [link];
const fragment = `
    game { id name }
`;

export const game = {fields, fragment};
