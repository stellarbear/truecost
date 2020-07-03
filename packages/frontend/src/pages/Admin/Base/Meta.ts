import {CString} from "components/generic/types";
import {base} from "./Base";

const url = new CString({
    key: "url",
    label: "url",
});

const fragment = `
    ${base.fragment}
    active
    name
    order
    url
`;
const fields = [...base.fields, url];

export const meta = {
    fragment,
    fields,
};
