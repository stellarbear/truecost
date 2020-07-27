import * as React from "react";
import {CRUD} from "components/generic/CRUD";
import {CLink, CSelect} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {CNumber} from "components/generic/types/CNumber";
import {base} from "./Base/Base";
import {game} from "./Base/Game";
import {enumValues, OptionType, OptionArea, OptionMerge} from "@truecost/shared"

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
            merge
            
			item { id name game { id } }
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
        options: {
            [OptionType.NOMINAL]: "$",
            [OptionType.RELATIVE]: "%"
        }
    });

    const area = new CSelect({
        multiple: false,
        key: "area",
        label: "area",
        options: {
            [OptionArea.LOCAL]: "local",
            [OptionArea.GLOBAL]: "global"
        }
    });

    const merge = new CSelect({
        multiple: false,
        key: "merge",
        label: "merge",
        options: {
            [OptionMerge.INCLUDE]: "include",
            [OptionMerge.EXCLUDE]: "exclude"
        }
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

    const fields = [item, price, free, type, area, merge];

    return (
        <CRUD
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
