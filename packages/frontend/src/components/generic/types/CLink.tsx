import * as React from "react";
import {ABase, IRender, ICtor} from "./ABase";
import {SelectFieldAsync, IQuery} from "../components/SelectFieldAsync";

export interface ILink extends ICtor<any> {
    query: IQuery;
    readOnly?: boolean;
    multiple?: boolean;
}

export class CLink extends ABase<any> {
    query: IQuery;
    readOnly: boolean;
    multiple: boolean;

    constructor({
                    query,
                    multiple = false, readOnly = false, ...rest
                }: ILink) {
        super(rest);
        this.query = query;
        this.readOnly = readOnly;
        this.multiple = multiple;
    }

    renderAddImplementation = this.SelectQueryField;
    renderFilterlementation = this.SelectQueryField;
    renderListlementation = this.SelectQueryField;

    SelectQueryField({value, onChange, id, state}: IRender<any>) {
        const {label, base} = this.data;
        const {multiple, query, readOnly} = this;

        return (
            <SelectFieldAsync
                label={label}
                multiple={multiple}
                record={state}
                disabled={readOnly}
                query={query}
                value={value || (multiple ? [] : null)}
                onChangeEvent={onChange}
            />
        );
    }
}
