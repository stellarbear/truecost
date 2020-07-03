import React from "react";
import {GeoPigeon, Zoom} from "components";
import {ABase, Component, IBase, IRender} from "./ABase";

export interface IGeo extends IBase {
    tooltip?: string;
    center?: number[];
}

export class CGeo extends ABase {
    tooltip?: string;
    center?: number[];

    constructor({center = [0, 0], tooltip = "Pin", ...rest}: IGeo) {
        super(rest);
        this.center = center;
        this.tooltip = tooltip;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asMultiGeo({...params});
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asMultiGeo({...params});
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => (<div></div>);

    asMultiGeo({value, onChange}: IRender): JSX.Element {
        const overrideValue = value == null ? [0, 0] : value;
        const {tooltip, center} = this;
        return (
            <Zoom
                smallProps={{width: 300, height: 60}}
                bigProps={{width: 600, height: 600}}>
                <GeoPigeon
                    values={[overrideValue]}
                    onMapClickEvent={(value: any) => {
                        console.log(value);
                        const stateValue = Array.isArray(value)
                            ? value.length > 0 ? value : null
                            : value;
                        onChange(stateValue);
                    }}
                />
            </Zoom>
        );
    }
}

/*
<Zoom
    smallProps={{ width: 300, height: 200 }}
    bigProps={{ width: 600, height: 600 }}>
        <GeoPigeon
            value={overrideValue}
            onChangeEvent={(value: any) => {
                console.log(value);
                const stateValue = Array.isArray(value)
                    ? value.length > 0 ? value : null
                    : value
                onChange(stateValue)
            }}
        />
    </Zoom>
*/
