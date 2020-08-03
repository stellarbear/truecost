import * as React from 'react';
import {CString, CCustom} from "components/generic/types";
import {base} from "./Base";
import EditorMetaTag from 'components/generic/components/EditorMetaTag';

const url = new CString({
    key: "url",
    label: "url",
});

const metatag = new CCustom({
    base: "[]",
    key: "metatag",
    label: "metatag",
    component: <EditorMetaTag/>,
});

const fragment = `
    ${base.fragment}
    url
    metatag
`;
const fields = [...base.fields, url, metatag];

export const meta = {
    fragment,
    fields,
};
