import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {base} from "./Base";

export const AdminReview: React.FC = () => {
    const crud = new CRUDgql({
        name: "Review",
        items: `
        ${base.fragment}
            who
            text
            title
		`,
    });

    const who = new CString({
        key: "who",
        label: "who",
    });

    const text = new CString({
        key: "text",
        label: "text",
    });

    const title = new CString({
        key: "title",
        label: "title",
    });

    const fields = [who, text, title];

    return (
        <CRUD

            title="Review"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...fields]}
            propsList={[...base.fields, ...fields]}
            propsFilter={[...base.fields, ...fields]}
        />
    );
};
