import React from "react";
import {SelectImage, Zoom} from "components";
import {ABase, Component, IBase, IRender} from "./ABase";
import {baseGame, baseUri} from "auxiliary/route";
import {Typography} from "@material-ui/core";

enum EImage { small, big }

export interface IImage extends IBase {
    path: string;
    overrideKey: string;
}

export class CImage extends ABase implements IImage {
    path: string;
    overrideKey: string;

    constructor({path, overrideKey, ...rest}: IImage) {
        super(rest);
        this.path = path;
        this.overrideKey = overrideKey;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asImage({...params}, EImage.big, type);
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asImage({...params}, EImage.small, type);
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => (<div></div>);

    asImage({value, onChange, id}: IRender, size: EImage, type: Component) {
        const {path, label} = this;
        const imageSrc = value
            ? URL.createObjectURL(value)
            : id
                ? `${baseUri}/${baseGame}/images/${path}/${id}/default?` + new Date().getTime()
                : null;

        const dimensionX = size == EImage.big ? 300 : 60;
        const dimensionY = size == EImage.big ? 128 : 60;

        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                {type === Component.Add ? <Typography variant="caption">{label}</Typography> : null}
                <Zoom
                    smallProps={{width: dimensionX, height: dimensionY}}
                    bigProps={{width: 600, height: 600}}>
                    <SelectImage
                        id={`image-${Component[type]}-${id}`}
                        src={imageSrc}
                        onChangeEvent={(value: any) => {
                            onChange(value);
                        }}/>
                </Zoom>
            </div>
        );
    }
}
