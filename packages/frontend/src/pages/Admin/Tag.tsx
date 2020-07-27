import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CRUDgql} from "auxiliary";
import {base} from "./Base/Base";
import {game} from "./Base/Game";
import {CLink} from "components/generic/types";

export const AdminTag: React.FC = () => {
    const crud = new CRUDgql({
        name: "Tag",
        items: `
			${base.fragment}
            ${game.fragment}
            
			item { id name game { id } }
		`,
    });
    
    const item = new CLink({
        key: "item",
        label: "item",
        query: {
            name: "ItemAll",
            fields: ["game"],
        },
        multiple: true,
    });

    const fields = [item];

    return (
        <CRUD
            title="Tag"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields, ...fields]}
            propsList={[...base.fields, ...game.fields, ...fields]}
            propsFilter={[...base.fields, ...game.fields, ...fields]}
        />
    );
};
