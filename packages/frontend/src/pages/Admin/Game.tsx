import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CCustom, CImage, CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {base} from "./Base";
import EditorPost from "components/generic/components/EditorPost";

export const AdminGame: React.FC = () => {
    const crud = new CRUDgql({
        name: "Game",
        items: `
            ${base.fragment}
            url
            seo
			twitter

            preview
			assistant
			background
		`,
    });

    const url = new CString({
        key: "url",
        label: "url",
    });

    const seo = new CCustom({
        base: "",
        key: "seo",
        label: "seo",
        component: <EditorPost />,
    });

    const twitter = new CString({
        key: "twitter",
        label: "twitter",
    });


    const assistant = new CImage({
        key: "assistant",
        label: "assistant",
        ext: "png",
        limit: 1,
    });
    const preview = new CImage({
        key: "preview",
        label: "preview",
        ext: "png",
        limit: 1,
    });
    const background = new CImage({
        key: "background",
        label: "background",
        ext: "jpg",
        limit: 1,
    });

    const fields = [url, seo, twitter, preview, assistant, background];

    return (
        <CRUD

            title="Game"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...fields]}
            propsList={[...base.fields, ...fields]}
            propsFilter={[...base.fields]}
        />
    );
};
