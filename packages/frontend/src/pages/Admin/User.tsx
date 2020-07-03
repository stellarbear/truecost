import React from "react";
import CRUD from "components/generic/CRUD";
import {CLink, CSelect, CString} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {CNumber} from "components/generic/types/CNumber";

interface UserProps {
}

const AdminUser: React.FC<UserProps> = (): JSX.Element => {
    const crud = new CRUDgql({
        name: "User",
        items: `
			id
			name
			email
			role
			session
			confirm
			passInfo
			reset
			count
			order {
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
    const passInfo = new CString({
        key: "passInfo",
        label: "passInfo",
        multiline: true,
    });

    const name = new CString({
        key: "name",
        label: "name",
    });

    const email = new CString({
        key: "email",
        label: "email",
    });

    const roles = ["anon", "user", "moderator", "admin"];
    const role = new CSelect({
        multiple: true,
        key: "role",
        label: "roles",
        values: roles,
        preRenderMap: roles.reduce((acc, cur) => ({...acc, [cur]: cur}), {}),
    });

    const session = new CString({
        key: "session",
        label: "session",
    });

    const confirm = new CString({
        key: "confirm",
        label: "confirm",
    });

    const reset = new CString({
        key: "reset",
        label: "reset",
    });

    const count = new CNumber({
        key: "count",
        label: "count",
        min: 0,
        max: 1000,
    });

    const order = new CLink({
        key: "order",
        label: "order",
        queryName: "userGetPossibleOrder",
        multiple: true,
        propName: "name",
    });

    return (
        <CRUD
            pack="input"
            title="User"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[]}
            propsList={[id, name, email, role, session, confirm, reset, count, order, passInfo]}
            propsFilter={[id, name, email, role, count, passInfo]}
        />
    );
};

export default AdminUser;
