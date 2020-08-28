import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {CNumber} from "components/generic/types/CNumber";
import {base} from "./Base/Base";

export const AdminSubscription: React.FC = () => {
    const crud = new CRUDgql({
        name: "Subscription",
        items: `
			${base.fragment}
            days
            price
            discount

            description
		`,
    });

    const days = new CNumber({
        key: "days",
        label: "days",
        min: 1,
        max: 1000,
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
        min: 1,
        max: 1000,
    });

    const description = new CString({
        key: "description",
        label: "description",
    });


    const fields = [price, days, discount, description];

    return (
        <CRUD
            title="Subscription"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...fields]}
            propsList={[...base.fields, ...fields]}
            propsFilter={[...base.fields, ...fields]}
        />
    );
};
