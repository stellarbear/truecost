import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {CCustom} from "components/generic/types/CCustom";
import {base} from "./Base";
import EditorMetaTag from "components/generic/components/EditorMetaTag";

export const AdminMeta: React.FC = () => {
    const crud = new CRUDgql({
        name: "Meta",
        items: `
            ${base.fragment}
            url
            tags
		`,
    });

    const url = new CString({
        key: "url",
        label: "url",
    });

    const tags = new CCustom({
        base: "[]",
        key: "tags",
        label: "tags",
        component: <EditorMetaTag/>,
    });

    const fields = [url, tags];

    return (
        <CRUD

            title="Meta"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...fields]}
            propsList={[...base.fields, ...fields]}
            propsFilter={[...base.fields, ...fields]}
        />
    );
};
