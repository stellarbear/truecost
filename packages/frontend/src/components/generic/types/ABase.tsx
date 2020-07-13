import {ErrorLabel} from "components";
import * as React from "react";

export enum Component { Add, Filter, List }

export interface IBase {
    key: string;
    def?: any;
    label: string;
    prepare?: (value: any | any[]) => any | any[];
}


export interface IRender {
    id: any;
    value: any;
    data: Record<string, any>;
    onChange: (value: any) => void;
}

export interface IARender extends IRender {
    errors: string[];
    component: Component;
}

export abstract class ABase implements IBase {
    def: any;
    id: string;
    key: string;
    label: string;
    prepare: (value: any | any[]) => any | any[];

    constructor({label, key, def = undefined, prepare = (value) => value}: IBase) {
        this.id = key;
        this.key = key;
        this.def = def;
        this.label = label;
        this.prepare = prepare;
    }

    render({component, errors, ...rest}: IARender) {
        const error = errors.join(",");

        const renderComponent = () => {
            switch (component) {
                case Component.Add:
                    return this.renderAddComponent({...rest}, component);
                case Component.List:
                    return this.renderListComponent({...rest}, component);
                case Component.Filter:
                    return this.renderFilterComponent({...rest}, component);
                default:
                    return null;
            }
        };

        return (
            <ErrorLabel error={error}>
                {renderComponent()}
            </ErrorLabel>
        );
    }

    abstract renderAddComponent(params: IRender, type: Component): JSX.Element;

    abstract renderListComponent(params: IRender, type: Component): JSX.Element;

    abstract renderFilterComponent(params: IRender, type: Component): JSX.Element;
}
