import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CRUDgql} from "auxiliary";
import {base} from "./Base/Base";
import {game} from "./Base/Game";
import {CCustom, CLink} from "components/generic/types";
import {EditorColor} from "components/generic/components/EditorColor";

export const AdminTag: React.FC = () => {
    const crud = new CRUDgql({
        name: "Tag",
        items: `
			${base.fragment}
            ${game.fragment}

            color
			item { id name game { id } }
			children { id name game { id } }
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

    const children = new CLink({
        key: "children",
        label: "children",
        query: {
            name: "TagAll",
            fields: ["game"],
        },
        multiple: true,
    });

    const color = new CCustom({
        base: "",
        key: "color",
        label: "color",
        component: <EditorColor />,
    });

    const fields = [item, children];

    return (
        <CRUD
            title="Tag"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields, ...fields]}
            propsList={[...base.fields, ...game.fields, color, ...fields]}
            propsFilter={[...base.fields, ...game.fields, ...fields]}
        />
    );
};
