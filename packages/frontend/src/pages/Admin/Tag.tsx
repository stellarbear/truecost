import * as React from "react";
import CRUD from "components/generic/CRUD";
import {CRUDgql} from "auxiliary";
import {base} from "./Base/Base";
import {game} from "./Base/Game";

export const AdminTag: React.FC = () => {
    const crud = new CRUDgql({
        name: "Tag",
        items: `
			${base.fragment}
			${game.fragment}
		`,
    });
    return (
        <CRUD
            pack="input"
            title="Tag"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields]}
            propsList={[...base.fields, ...game.fields]}
            propsFilter={[...base.fields, ...game.fields]}
        />
    );
};
