import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CBoolean, CImage, CNumber, CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {base} from "./Base";
import {game} from "./Base/Game";
import {CCustom} from "components/generic/types/CCustom";
import {CLink} from "components/generic/types/CLink";
import EditorPost from "components/generic/components/EditorPost";
import EditorRange from "components/generic/components/EditorRange";
import {rangeBase} from "@truecost/shared";

export const AdminItem: React.FC = () => {
    const crud = new CRUDgql({
        name: "Item",
        items: `
        ${base.fragment}
        ${game.fragment}
        url
            link
            youtube
			images

            rate
            buy
            eta
            price
            range
			discount
			limit

			obtain
			requirements
            description
            topOffer
            direct

			tag { id name game { id } }
			option { id name game { id } }
			item { id name game { id } }
		`,
    });

    const url = new CString({
        key: "url",
        label: "url",
    });

    const link = new CString({
        key: "link",
        label: "link",
    });

    const youtube = new CString({
        key: "youtube",
        label: "youtube",
    });

    const images = new CImage({
        key: "images",
        label: "image",
        ext: "png",
        limit: 1,
    });

    const buy = new CNumber({
        key: "buy",
        label: "buy",
        min: 0,
        max: 1000000,
    });

    const rate = new CNumber({
        key: "rate",
        label: "Rating",
        min: 0,
        max: 1000000,
    });

    const eta = new CNumber({
        key: "eta",
        label: "eta (min.)",
        min: 1,
        max: 1000000,
    });

    const price = new CNumber({
        key: "price",
        label: "price",
        min: 1,
        max: 100000,
    });

    const discount = new CNumber({
        key: "discount",
        label: "discount",
        min: 0,
        max: 10000,
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

    const description = new CCustom({
        base: "",
        key: "description",
        label: "description",
        component: <EditorPost/>,
    });

    const requirements = new CCustom({
        base: "",
        key: "requirements",
        label: "requirements",
        component: <EditorPost/>,
    });

    const isTopOffer = new CBoolean({
        key: "topOffer",
        label: "offer",
        textTrue: "top",
        textFalse: "usual",
    });
    const direct = new CBoolean({
        key: "direct",
        label: "direct",
        textTrue: "direct",
        textFalse: "default",
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
    });
    const option = new CLink({
        key: "option",
        label: "option",
        query: {
            name: "OptionAll",
            fields: ["game"],
        },
        multiple: true,
    });

    const range = new CCustom({
        base: JSON.stringify(rangeBase),
        key: "range",
        label: "range",
        component: <EditorRange/>,
    });

    const fields = [url, link, youtube, images, price, buy, rate, eta, range, discount, limit, obtain,
        requirements, description, direct, isTopOffer, item, tag, option];

    return (
        <CRUD

            title="Item"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields, ...fields]}
            propsList={[...base.fields, ...game.fields, ...fields]}
            propsFilter={[...base.fields, ...game.fields, ...fields]}
        />
    );
};
