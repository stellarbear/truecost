import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CImage, CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
//import {meta} from "./Base/Meta";
//import {game} from "./Base/Game";
import {game} from "./Base/Game";
import {CCustom} from "components/generic/types/CCustom";
import {CLink} from "components/generic/types/CLink";
import EditorPost from "components/generic/components/EditorPost";
import {base} from "./Base";

export const AdminInfo: React.FC = () => {
    const crud = new CRUDgql({
        name: "Info",
        items: `
        ${base.fragment}
        ${game.fragment}
            cta
            text
            redirect
			images

			tag { id name game { id } }
			item { id name game { id } }
		`,
    });


    const text = new CCustom({
        base: "",
        key: "text",
        label: "text",
        component: <EditorPost/>,
    });

    const cta = new CString({
        key: "cta",
        label: "cta",
    });

    const redirect = new CString({
        key: "redirect",
        label: "redirect",
    });

    const images = new CImage({
        key: "images",
        label: "image",
        ext: "jpg",
        limit: 1,
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

    const tag = new CLink({
        key: "tag",
        label: "tag",
        query: {
            name: "TagAll",
            fields: ["game"],
        },
        multiple: true,
        readOnly: true,
    });

    const fields = [cta, text, redirect, images, item, tag];

    return (
        <CRUD

            title="Info"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields, ...fields]}
            propsList={[...base.fields, ...game.fields, ...fields]}
            propsFilter={[...base.fields, ...game.fields, ...fields]}
        />
    );
};
