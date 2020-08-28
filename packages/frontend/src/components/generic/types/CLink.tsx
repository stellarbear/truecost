import * as React from "react";
import {ABase, ICtor, IRender} from "./ABase";
import {IQuery, SelectFieldAsync} from "../components/SelectFieldAsync";

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

    SelectQueryField = (r: IRender<any>) => this.SelectField(r, false);

    renderAddImplementation = this.SelectQueryField;
    renderFilterlementation = this.SelectQueryField;

    SelectReadOnlyQueryField = (r: IRender<any>) => this.SelectField(r, this.readOnly);

    renderListlementation = this.SelectReadOnlyQueryField;

    SelectField({value, onChange, state}: IRender<any>, readOnly: boolean) {
        const {label} = this.data;
        const {multiple, query} = this;

        return (
            <SelectFieldAsync
                label={label}
                multiple={multiple}
                record={state}
                readOnly={readOnly}
                query={query}
                value={value || (multiple ? [] : null)}
                onChangeEvent={onChange}
            />
        );
    }
}
