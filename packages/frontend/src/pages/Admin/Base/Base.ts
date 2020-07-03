import {CBoolean, CString} from "components/generic/types";
import {CNumber} from "components/generic/types/CNumber";

const active = new CBoolean({
    def: false,
    key: "active",
    label: "active",
    textTrue: "active",
    textFalse: "inactive",
});

const name = new CString({
    key: "name",
    label: "name",
});

const order = new CNumber({
    key: "order",
    label: "order",
    min: -10,
    max: 100,
});

const fragment = `
    active
    name
    order
`;
const fields = [active, name, order];

export const base = {
    fragment,
    fields,
};