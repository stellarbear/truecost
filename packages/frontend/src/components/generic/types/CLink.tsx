import * as React from "react";
import {ABase, Component, IBase, IRender} from "./ABase";
import {SelectQueryField} from "components";
import {IQuery} from "components/SelectQueryField";

export interface ILink extends IBase {
    query: IQuery;
    readOnly?: boolean;
    multiple?: boolean;
    propName: string;
}

export class CLink extends ABase {
    query: IQuery;
    readOnly: boolean;
    multiple: boolean;
    propName: string;

    constructor({propName, query, multiple = false, readOnly = false, ...rest}: ILink) {
        super(rest);
        this.query = query;
        this.readOnly = readOnly;
        this.propName = propName;
        this.multiple = multiple;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asMultiSelect({...params}, type);
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asMultiSelect({...params}, type);
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => this.asMultiSelect({...params}, type);

    asMultiSelect({value, onChange, id, data}: IRender, type: Component): JSX.Element {
        const {multiple, query, label, propName, readOnly} = this;

        //	The cost of backend simplification
        //	flatMap only if data is received from backend, default behavior onChange
        let preRenderMap = {};
        const valueArray = Array.isArray(value) ? value : [value].filter(v => v);
        const fromBackend = !valueArray.some(v => v.id == undefined || v[propName] == undefined);
        if (fromBackend) {
            preRenderMap = valueArray.reduce((obj, cur) => ({...obj, [cur.id]: cur[propName]}), {});
            value = valueArray.map(v => v.id);
        }

        const overrideSelectValue = value == null
            ? []
            : Array.isArray(value)
                ? value
                : [value];

        return (
            <SelectQueryField
                style={{width: 200}}
                label={label}
                multiple={multiple}
                record={data!}
                disabled={type === Component.List ? readOnly : false}
                query={query}
                propName={propName}
                preRenderMap={preRenderMap}
                value={overrideSelectValue}
                onChangeEvent={(value: string[]) => {
                    const stateValue = multiple
                        ? value.length > 0 ? value : null
                        : value[0] ?? null;
                    onChange(stateValue);
                }}
            />
        );
    }
}
