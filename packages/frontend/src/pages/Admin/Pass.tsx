import React from "react";
import CRUD from "components/generic/CRUD";
import {CBoolean, CDate, CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {CNumber} from "components/generic/types/CNumber";

interface PassProps {
}

const AdminPass: React.FC<PassProps> = (): JSX.Element => {
    const crud = new CRUDgql({
        name: "Pass",
        items: `
			id
			name
			text
			price
			discount
			duration
			expiration
			isActive
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

    const text = new CString({
        key: "text",
        label: "text",
    });

    const discount = new CNumber({
        key: "discount",
        label: "discount(%)",
        min: 0,
        max: 100,
    });

    const price = new CNumber({
        key: "price",
        label: "price ($)",
        min: 0,
        max: 10000,
    });

    const expiration = new CDate({
        key: "expiration",
        label: "expiration",
    });

    const duration = new CNumber({
        key: "duration",
        label: "duration (days)",
        min: 0,
        max: 365,
    });

    const isActive = new CBoolean({
        key: "isActive",
        label: "isActive",
        textAlt: "inactive",
        text: "active",
    });

    return (
        <CRUD
            pack="input"
            title="Pass"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[name, text, price, duration, discount, expiration, isActive]}
            propsList={[id, name, text, price, duration, discount, expiration, isActive]}
            propsFilter={[id, name, text, price, duration, discount, isActive]}
        />
    );
};

export default AdminPass;
