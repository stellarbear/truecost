import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CBoolean, CString, CNumber, CImage} from "components/generic/types";
import {CRUDgql} from "auxiliary";
//import {meta} from "./Base/Meta";
//import {game} from "./Base/Game";
import {meta} from "./Base/Meta";
import {game} from "./Base/Game";
import EditorRange from "components/EditorRange";
import {CCustom} from "components/generic/types/CCustom";
import {CLink} from "components/generic/types/CLink";
import EditorPost from "components/EditorPost";

export const AdminItem: React.FC = () => {
    const crud = new CRUDgql({
        name: "Item",
        items: `
        ${meta.fragment}
        ${game.fragment}
            link
			images

            price
            range
            single
			discount
			limit

			obtain
			requirements
			topOffer

			tag { id name game { id } }
			option { id name game { id } }
			item { id name game { id } }
		`,
    });

    const link = new CString({
        key: "link",
        label: "link",
    });

    const images = new CImage({
        key: "images",
        label: "image",
        ext: "png",
        limit: 1,
    });


    const price = new CNumber({
        key: "price",
        label: "price",
        min: 1,
        max: 1000,
    });

    const discount = new CNumber({
        key: "discount",
        label: "discount",
        min: 0,
        max: 100,
    });

    const limit = new CNumber({
        key: "limit",
        label: "limit",
        min: 0,
        max: 10,
    });
    
    const obtain = new CCustom({
        base: "",
        key: "obtain",
        label: "obtain",
        component: <EditorPost/>,
    });
    
    const requirements = new CCustom({
        base: "",
        key: "requirements",
        label: "requirements",
        component: <EditorPost/>,
    });

    const single = new CBoolean({
        key: "single",
        label: "single",
        textTrue: "single",
        textFalse: "double",
    });

    const isTopOffer = new CBoolean({
        key: "topOffer",
        label: "offer",
        textTrue: "top",
        textFalse: "usual",
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
    const option = new CLink({
        key: "option",
        label: "option",
        query: {
            name: "OptionAll",
            fields: ["game"],
        },
        multiple: true,
        readOnly: true,
    });

    const range = new CCustom({
        base: "[]",
        key: "range",
        label: "range",
        component: <EditorRange/>,
    });

    const fields = [link, images, price, range, single, discount, limit, obtain, requirements, isTopOffer, item, tag, option];

    return (
        <CRUD
            
            title="Item"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...meta.fields, ...game.fields, ...fields]}
            propsList={[...meta.fields, ...game.fields, ...fields]}
            propsFilter={[...meta.fields, ...game.fields, ...fields]}
        />
    );
};
