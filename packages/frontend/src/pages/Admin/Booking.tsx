import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CRUDgql} from "auxiliary";
import {base} from "./Base/Base";
import {game} from "./Base/Game";
import {CLink, CSelect, CString, CNumber, CImage} from "components/generic/types";
import {StatusType} from "@truecost/shared";

export const AdminBooking: React.FC = () => {
    const crud = new CRUDgql({
        name: "Booking",
        items: `
			${base.fragment}
            
            status

            user { id name }
            
            total
            code
            pi

            info
            data

			images
		`,
    });

    const images = new CImage({
        key: "images",
        label: "image",
        ext: "jpg",
        limit: 5,
    });

    const user = new CLink({
        key: "user",
        label: "user",
        query: {
            name: "UserAll",
        },
        multiple: false,
        readOnly: true,
    });

    const status = new CSelect({
        multiple: false,
        key: "status",
        label: "status",
        options: {
            [StatusType.AWAITING_FOR_CONTACT]: "awaiting for contact",
            [StatusType.CLOSED]: "closed",
            [StatusType.DONE]: "done",
            [StatusType.IN_PROGRESS]: "in progress",
            [StatusType.PAUSED]: "paused",
        }
    });

    const total = new CNumber({
        key: "total",
        label: "total",
        min: 1,
        max: 100000,
    });
    const code = new CString({
        key: "code",
        label: "code",
        editable: false,
    });
    const pi = new CString({
        key: "pi",
        label: "payment",
        editable: false,
    });
    const info = new CString({
        key: "info",
        label: "info",
        editable: false,
    });
    const data = new CString({
        key: "data",
        label: "data",
        editable: false,
    });

    const fields = [images, user, status, total, code, pi, info, data];

    return (
        <CRUD
            title="Booking"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsList={[...base.fields, ...fields]}
            propsFilter={[...base.fields, ...fields]}
        />
    );
};
