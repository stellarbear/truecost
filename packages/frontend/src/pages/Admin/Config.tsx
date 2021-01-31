import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CRUDgql} from "auxiliary";
import {CCustom} from "components/generic/types/CCustom";
import {base} from "./Base";
import { EditorInfo } from "components/generic/components/EditorInfo";

export const AdminConfig: React.FC = () => {
    const crud = new CRUDgql({
        name: "Config",
        items: `
            ${base.fragment}
            
            data
		`,
    });

    const data = new CCustom({
        base: "{}",
        key: "data",
        label: "data",
        component: <EditorInfo/>,
    });

    const fields = [data];

    return (
        <CRUD

            title="Config"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...fields]}
            propsList={[...base.fields, ...fields]}
            propsFilter={[...base.fields, ...fields]}
        />
    );
};
