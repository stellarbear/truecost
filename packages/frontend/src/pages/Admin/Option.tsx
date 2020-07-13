import * as React from "react";
import CRUD from "components/generic/CRUD";
import {CLink, CSelect} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {CNumber} from "components/generic/types/CNumber";
import {base} from "./Base/Base";
import {game} from "./Base/Game";
import {enumValues, OptionType, OptionArea} from "@truecost/shared"

export const AdminOption: React.FC = () => {
    const crud = new CRUDgql({
        name: "Option",
        items: `
			${base.fragment}
			${game.fragment}
			price
			free

			type
			area
		`,
    });


    const price = new CNumber({
        key: "price",
        label: "price",
        min: 1,
        max: 1000,
    });

    const free = new CNumber({
        key: "free",
        label: "free",
        min: 0,
        max: 1000,
    });

    const type = new CSelect({
        multiple: false,
        key: "type",
        label: "type",
        values: enumValues(OptionType),
    });
    
    const area = new CSelect({
        multiple: false,
        key: "area",
        label: "area",
        values: enumValues(OptionArea),
    });

    const fields = [price, free, type, area];

    return (
        <CRUD
            pack="input"
            title="Option"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields, ...fields]}
            propsList={[...base.fields, ...game.fields, ...fields]}
            propsFilter={[...base.fields, ...game.fields, ...fields]}
        />
    );
};
