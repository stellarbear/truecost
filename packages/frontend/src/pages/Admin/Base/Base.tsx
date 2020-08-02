import * as React from 'react';
import {CBoolean, CString} from "components/generic/types";
import {CNumber} from "components/generic/types/CNumber";

const active = new CBoolean({
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
    base: 0,
    key: "order",
    label: "order",
    min: -1000,
    max: 1000,
});

const fragment = `
    id
    active
    name
    order
`;
const fields = [active, name, order];

export const base = {
    fragment,
    fields,
};