import React from "react";
import CRUD from "components/generic/CRUD";
import {CLink} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {base} from "./Base/Base";
import {game} from "./Base/Game";

interface CategoryProps {
}

const AdminCategory: React.FC<CategoryProps> = (): JSX.Element => {
    const crud = new CRUDgql({
        name: "Category",
        items: `
		${base.fragment}
		${game.fragment}

		parent { id name game { id } }
		children { id name game { id } }
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

    const children = new CLink({
        key: "children",
        label: "children",
        query: {
            name: "CategoryAll",
            field: "game",
        },
        multiple: true,
        propName: "name",
    });
    /*
        const item = new CLink({
            key: "item",
            label: "item",
            queryName: "categoryGetPossibleItems",
            multiple: true,
            propName: "name",
        });
    */
    //	Item - parent filters do not work
    //	TODO: should make different queries on add / filter,
    return (
        <CRUD
            pack="input"
            title="Category"
            //tree="categoryGetTree"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields, parent]}
            propsList={[...base.fields, ...game.fields, parent, children]}
            propsFilter={[...base.fields, ...game.fields]}
        />
    );
};

export default AdminCategory;
