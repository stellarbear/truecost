import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CBoolean, CString, CNumber, CImage} from "components/generic/types";
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
            metatag
		`,
    });

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

    const fields = [url, metatag];

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
