import * as React from "react";
import {ABase, ICtor, IRender} from "./ABase";
import {IQuery, SelectFieldAsync} from "../components/SelectFieldAsync";

export interface ILink extends ICtor<any> {
    query: IQuery;
    readOnly?: boolean;
    multiple?: boolean;
    path?: string;
}

export class CLink extends ABase<any> {
    path: string;
    query: IQuery;
    readOnly: boolean;
    multiple: boolean;

    constructor({
                    query, path = "name",
                    multiple = false, readOnly = false, ...rest
                }: ILink) {
        super(rest);
        this.path = path;
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
        const {multiple, query, path} = this;

        return (
            <SelectFieldAsync
                label={label}
                multiple={multiple}
                record={state}
                path={path}
                readOnly={readOnly}
                query={query}
                value={value || (multiple ? [] : null)}
                onChangeEvent={onChange}
            />
        );
    }
}
