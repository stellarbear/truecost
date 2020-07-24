import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CImage, CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {meta} from "./Base/Meta";

export const AdminGame: React.FC = () => {
    const crud = new CRUDgql({
        name: "Game",
        items: `
			${meta.fragment}
			twitter

			assistant
			background
		`,
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
        ext: "jpg",
        limit: 1,
    });

    return (
        <CRUD
            
            title="Game"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...meta.fields, twitter, assistant, background]}
            propsList={[...meta.fields, twitter, assistant, background]}
            propsFilter={[...meta.fields]}
        />
    );
};
