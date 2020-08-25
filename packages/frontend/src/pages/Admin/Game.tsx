import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CImage, CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {base} from "./Base";

export const AdminGame: React.FC = () => {
    const crud = new CRUDgql({
        name: "Game",
        items: `
            ${base.fragment}
            url
			twitter

			assistant
			background
		`,
    });

    const url = new CString({
        key: "url",
        label: "url",
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
    const background = new CImage({
        key: "background",
        label: "background",
        ext: "gif",
        limit: 1,
    });

    const fields = [url, twitter, assistant, background]

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
