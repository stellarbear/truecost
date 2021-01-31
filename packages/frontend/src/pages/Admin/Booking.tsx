import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CRUDgql} from "auxiliary";
import {base} from "./Base/Base";
import {CCustom, CImage, CLink, CNumber, CSelect, CString} from "components/generic/types";
import {Currencies, CurrencyKey, StatusType} from "@truecost/shared";
import {EditorItems} from "components/generic/components/EditorItems";
import {EditorInfo} from "components/generic/components/EditorInfo";

export const AdminBooking: React.FC = () => {
    const crud = new CRUDgql({
        name: "Booking",
        items: `
			${base.fragment}

            status

            user { id name }

            currency
            total
            code
            pi
            game

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
        path: "email",
        key: "user",
        label: "user",
        query: {
            name: "UserAll",
        },
        multiple: false,
        readOnly: true,
    });

    const currency = new CSelect({
        multiple: false,
        key: "currency",
        label: "currency",
        options: Object.keys(Currencies).reduce((acc, cur) => {
            acc[cur] = Currencies[cur as CurrencyKey].id;
            return acc;
        }, {} as any),
    });

    const status = new CSelect({
        multiple: false,
        key: "status",
        label: "status",
        options: {
            [StatusType.AWAITING_FOR_PAYMENT]: "awaiting for payment",
            [StatusType.AWAITING_FOR_CONTACT]: "awaiting for contact",
            [StatusType.BOOSTER_SEARCH]: "searching for booster",
            [StatusType.CLOSED]: "closed",
            [StatusType.DONE]: "done",
            [StatusType.IN_PROGRESS]: "in progress",
            [StatusType.PAUSED]: "paused",
        },
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
    const game = new CString({
        key: "game",
        label: "game",
    });
    const pi = new CString({
        key: "pi",
        label: "payment",
    });

    const data = new CCustom({
        base: "[]",
        key: "data",
        label: "data",
        component: <EditorItems/>,
    });
    const info = new CCustom({
        base: "{}",
        key: "info",
        label: "info",
        component: <EditorInfo/>,
    });

    const fields = [images, currency, user, status, total, code, pi, game, info, data];

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
