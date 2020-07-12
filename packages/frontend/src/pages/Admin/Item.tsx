import React from "react";
import CRUD from "components/generic/CRUD";
import {CBoolean, CLink, CString, CStringCustom} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {CImageList} from "components/generic/types/CImageList";
import {CNumber} from "components/generic/types/CNumber";
import {meta} from "./Base/Meta";
import {game} from "./Base/Game";
import EditorRange from "components/EditorRange";

export const AdminItem: React.FC=  () => {
    const crud = new CRUDgql({
        name: "Item",
        items: `
			${meta.fragment}
			${game.fragment}
			link
			images

            price
            range
			discount
			limit

			obtain
			requirements
			topOffer

			tag { id name game { id } }
			option { id name game { id } }
			category { id name game { id } }
			item { id name game { id } }
		`,
    });


    const link = new CString({
        key: "link",
        label: "link",
    });


    const images = new CImageList({
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

    const obtain = new CString({
        key: "obtain",
        label: "obtain",
        multiline: true,
    });

    const requirements = new CString({
        key: "requirements",
        label: "requirements",
        multiline: true,
    });


    const isTopOffer = new CBoolean({
        def: false,
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
            field: "game",
        },
        multiple: true,
        propName: "name",
    });
    const tag = new CLink({
        key: "tag",
        label: "tag",
        query: {
            name: "TagAll",
            field: "game",
        },
        multiple: true,
        propName: "name",
    });
    const option = new CLink({
        key: "option",
        label: "option",
        query: {
            name: "OptionAll",
            field: "game",
        },
        multiple: true,
        propName: "name",
    });

    const category = new CLink({
        key: "category",
        label: "category",
        query: {
            name: "CategoryAll",
            field: "game",
        },
        multiple: true,
        propName: "name",
    });

    const range = new CStringCustom({
        key: "range",
        label: "range",
        component: <EditorRange/>,
    });
    
    const fields = [link, images, price, range, discount, limit, obtain, requirements, isTopOffer, item, tag, option, category];

    return (
        <CRUD
            pack="input"
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
