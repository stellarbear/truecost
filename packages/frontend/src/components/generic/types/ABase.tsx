import * as React from "react";
import {Typography} from "@material-ui/core";
import ErrorLabel from "../components/ErrorLabel";

export interface ICtor<T = any> {
    key: string,
    label: string,
    base?: T,
}

export interface IRender<T = any> {
    id?: string;
    value: T;
    error?: string
    state: Record<string, any>;
    onChange: (value?: T) => void;
}

export abstract class ABase<T = any> {
    constructor(
        public readonly data: ICtor<T>,
    ) {
    }

    private renderError = (props: IRender<T>, implementation: (props: IRender<T>) => React.ReactNode) => (
        <ErrorLabel error={props.error}>
            {implementation(props)}
        </ErrorLabel>
    )

    renderList = (props: IRender<T>) => (
        <ErrorLabel error={props.error}>
            {this.renderListlementation(props)}
        </ErrorLabel>
    )
    renderAdd = (props: IRender<T>) => (
        <ErrorLabel error={props.error}>
            {this.renderAddImplementation(props)}
        </ErrorLabel>
    )
    renderFilter = (props: IRender<T>) => (
        <ErrorLabel error={props.error}>
            {this.renderFilterlementation(props)}
        </ErrorLabel>
    )

    abstract renderAddImplementation(props: IRender<any>): React.ReactNode;

    abstract renderFilterlementation(props: IRender<any>): React.ReactNode;

    abstract renderListlementation(props: IRender<any>): React.ReactNode;

    protected NoControl = () => (<Typography>No control</Typography>)
}
