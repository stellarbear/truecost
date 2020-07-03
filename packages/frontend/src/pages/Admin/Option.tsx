import React from "react";
import CRUD from "components/generic/CRUD";
import {CLink, CSelect} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import {CNumber} from "components/generic/types/CNumber";
import {base} from "./Base/Base";
import {game} from "./Base/Game";

interface OptionProps {
}

const AdminOption: React.FC<OptionProps> = (): JSX.Element => {
    const crud = new CRUDgql({
        name: "Option",
        items: `
			${base.fragment}
			${game.fragment}
			price
			free

			type
			area
			filter

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

    const types = ["awaiting for contact", "in progress", "paused", "done", "refund"];
    const type = new CSelect({
        multiple: false,
        key: "type",
        label: "type",
        values: types,
        preRenderMap: types.reduce((acc, cur) => ({...acc, [cur]: cur}), {}),
    });
    const areas = ["awaiting for contact", "in progress", "paused", "done", "refund"];
    const area = new CSelect({
        multiple: false,
        key: "area",
        label: "area",
        values: areas,
        preRenderMap: areas.reduce((acc, cur) => ({...acc, [cur]: cur}), {}),
    });
    const filters = ["awaiting for contact", "in progress", "paused", "done", "refund"];
    const filter = new CSelect({
        multiple: false,
        key: "filter",
        label: "filter",
        values: filters,
        preRenderMap: filters.reduce((acc, cur) => ({...acc, [cur]: cur}), {}),
    });
    const item = new CLink({
        key: "item",
        label: "item",
        query: {
            name: "ItemAll",
            field: "game",
        },
        multiple: true,
        propName: "name",
    });

    const fields = [price, free, type, area, filter];

    return (
        <CRUD
            pack="input"
            title="Option"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...base.fields, ...game.fields, ...fields]}
            propsList={[...base.fields, ...game.fields, ...fields, item]}
            propsFilter={[...base.fields, ...game.fields, ...fields]}
        />
    );
};

export default AdminOption;
