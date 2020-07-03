import React from "react";
import CRUD from "components/generic/CRUD";
import {CLink} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {base} from "./Base/Base";
import {game} from "./Base/Game";

interface TagProps {
}

const AdminTag: React.FC<TagProps> = (): JSX.Element => {
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
            field: "game",
        },
        multiple: true,
        propName: "name",
    });
    return (
        <CRUD
            pack="input"
            title="Tag"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields]}
            propsList={[...base.fields, ...game.fields, item]}
            propsFilter={[...base.fields, ...game.fields]}
        />
    );
};

export default AdminTag;
