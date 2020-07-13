import * as React from "react";
import CRUD from "components/generic/CRUD";
import {CLink} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {base} from "./Base/Base";
import {game} from "./Base/Game";

export const AdminCategory: React.FC = () => {
    const crud = new CRUDgql({
        name: "Category",
        items: `
		${base.fragment}
		${game.fragment}

		parent { id name game { id } }
		`,
    });

    const parent = new CLink({
        key: "parent",
        label: "parent",
        query: {
            name: "CategoryAll",
            field: "game",
        },
        multiple: false,
        propName: "name",
    });

    return (
        <CRUD
            pack="input"
            title="Category"
            //tree="categoryGetTree"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields, parent]}
            propsList={[...base.fields, ...game.fields, parent]}
            propsFilter={[...base.fields, ...game.fields, parent]}
        />
    );
};