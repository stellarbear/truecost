import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CCustom, CDate, CImage, CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {base, game} from "./Base";
import EditorPost from "components/generic/components/EditorPost";

export const AdminBlog: React.FC = () => {
    const crud = new CRUDgql({
        name: "Blog",
        items: `
            ${base.fragment}
			${game.fragment}
            url

			date
			preview
			text

			images
		`,
    });


    const url = new CString({
        key: "url",
        label: "url",
    });


    const image = new CImage({
        key: "images",
        label: "image",
        ext: "jpg",
        limit: 1,
    });

    const date = new CDate({
        type: "datetime-local",
        key: "date",
        label: "date",
    });

    const text = new CCustom({
        base: "",
        key: "text",
        label: "text",
        component: <EditorPost />,
    });

    const preview = new CString({
        key: "preview",
        label: "preview",
        multiline: true,
    });

    const fields = [url, text, date, preview];

    return (
        <CRUD
            title="Blog"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields, ...fields, image]}
            propsList={[...base.fields, ...game.fields, ...fields, image]}
            propsFilter={[...base.fields, ...game.fields, ...fields]}
        />
    );
};
