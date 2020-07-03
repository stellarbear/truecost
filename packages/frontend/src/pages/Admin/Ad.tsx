import React from "react";
import CRUD from "components/generic/CRUD";
import {CImage, CLink, CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {CNumber} from "components/generic/types/CNumber";

interface AdProps {
}

const AdminAd: React.FC<AdProps> = (): JSX.Element => {
    const crud = new CRUDgql({
        name: "Ad",
        items: `
			id
			name
			order
			text
			redirect
			tag{
				id
				name
			}
			category{
				id
				name
			}
			item{
				id
				name
			}
		`,
    });

    const id = new CString({
        key: "id",
        label: "id",
        editable: false,
    });

    const name = new CString({
        key: "name",
        label: "name",
    });

    const order = new CNumber({
        key: "order",
        label: "order",
        min: -1000,
        max: 1000,
    });

    const text = new CString({
        key: "text",
        label: "text",
        multiline: true,
    });

    const redirect = new CString({
        key: "redirect",
        label: "redirect",
        multiline: true,
    });

    const image = new CImage({
        key: "image",
        label: "image",
        path: "carousel",
        overrideKey: "id",
    });

    const category = new CLink({
        key: "category",
        label: "category",
        queryName: "adGetPossibleCategory",
        multiple: false,
        propName: "name",
    });
    const tag = new CLink({
        key: "tag",
        label: "tag",
        queryName: "adGetPossibleTag",
        multiple: true,
        propName: "name",
    });
    const item = new CLink({
        key: "item",
        label: "item",
        queryName: "adGetPossibleItem",
        multiple: true,
        propName: "name",
    });

    return (
        <CRUD
            pack="input"
            title="Ad"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[name, text, image, order, category, tag, item, redirect]}
            propsList={[id, name, text, image, order, category, tag, item, redirect]}
            propsFilter={[id, name, text, order, redirect]}
        />
    );
};

export default AdminAd;
