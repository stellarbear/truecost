import React from "react";
import CRUD from "components/generic/CRUD";
import {CImageList, CLink, CSelect, CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";

interface OrderProps {
}

const AdminOrder: React.FC<OrderProps> = (): JSX.Element => {
    const crud = new CRUDgql({
        name: "Order",
        items: `
			id
			name
			details
			metadata
			status
			history
			preview
			user {
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

    const details = new CString({
        key: "details",
        label: "details",
    });

    const metadata = new CString({
        key: "metadata",
        label: "metadata",
    });

    const history = new CString({
        key: "history",
        label: "history",
        editable: false,
    });

    const preview = new CImageList({
        key: "preview",
        label: "preview",
        path: "order",
    });

    const statuses = ["awaiting for contact", "in progress", "paused", "done", "refund"];
    const status = new CSelect({
        multiple: false,
        key: "status",
        label: "status",
        values: statuses,
        preRenderMap: statuses.reduce((acc, cur) => ({...acc, [cur]: cur}), {}),
    });

    const user = new CLink({
        key: "user",
        label: "user",
        queryName: "orderGetPossibleUser",
        multiple: false,
        propName: "name",
    });


    return (
        <CRUD
            pack="input"
            title="Order"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[name, details, metadata, user, preview]}
            propsList={[id, name, details, status, history, metadata, user, preview]}
            propsFilter={[id, name, details, status, metadata, user]}
        />
    );
};

export default AdminOrder;
