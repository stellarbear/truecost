import * as React from "react";
import {Badge, Typography} from "@material-ui/core";
import {ABase, Component, IBase, IRender} from "./ABase";
import {AddBox, RemoveCircle} from "@material-ui/icons";
import {SelectImage, Zoom} from "components";
import {baseUri} from "auxiliary/route";

enum EImage {small, big}

export interface IImageList extends IBase {
    limit?: number;
    size?: number;
    ext: string;
}

export class CImageList extends ABase implements IImageList {
    limit: number;
    size: number;
    ext: string;

    constructor({limit = 0, size = 6 * 1024 * 1024, ext, ...rest}: IImageList) {
        super(rest);
        this.size = size;
        this.limit = limit;
        this.ext = ext;
    }

    renderAddComponent = (params: IRender, type: Component): JSX.Element => this.asImage({...params}, EImage.big, type);
    renderListComponent = (params: IRender, type: Component): JSX.Element => this.asImage({...params}, EImage.small, type);
    renderFilterComponent = (params: IRender, type: Component): JSX.Element => (<div></div>);

    asImage({value, onChange, id}: IRender, factor: EImage, type: Component) {
        const {label, limit, ext, size} = this;
        const dimension = factor == EImage.big ? 128 : 48;

        const overrideListValue = value == null ? [] : value as any[];

        return (
            <div>
                {type === Component.Add ? <Typography variant="caption">{label}</Typography> : null}
                <div style={{
                    overflow: "auto",
                    maxWidth: 300,
                    display: "flex",
                    flexWrap: "nowrap",
                }}>
                    {
                        (overrideListValue).map((val, index) => {
                            const imageSrc = (typeof val != "string")
                                ? URL.createObjectURL(val)
                                : id
                                    ? `${baseUri}/${id}/${val}/u.${ext}`
                                    : null;


                            return (
                                <div key={`imageList-${Component[type]}-${id}-${index}-list`}
                                    style={{padding: "16px 8px"}}>
                                    <Badge
                                        badgeContent={
                                            <RemoveCircle
                                                onClick={() => onChange([...overrideListValue.filter(v => v != val)])}
                                                style={{width: 16, height: 16, marginLeft: -4, marginRight: -4}} />
                                        }
                                        anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                                        style={{cursor: "pointer "}}
                                        color="primary">
                                        <Zoom
                                            smallProps={{width: dimension, height: dimension}}
                                            bigProps={{width: 600, height: 600}}>
                                            <SelectImage
                                                ext={ext}
                                                size={size}
                                                id={`imageList-${Component[type]}-${id}-${label}-${index}`}
                                                src={imageSrc}
                                                onChangeEvent={(value: any) => {
                                                    const newList = [...overrideListValue];
                                                    newList[index] = value;
                                                    onChange(newList);
                                                }} />
                                        </Zoom>
                                    </Badge>
                                </div>
                            );
                        })
                    }
                    {(limit === 0 || overrideListValue.length < limit) && (
                        <div key={`imageList-${Component[type]}-${id}-new`} style={{padding: "16px 8px"}}>
                            <SelectImage
                                ext={ext}
                                size={size}
                                src={null}
                                mock={<AddBox />}
                                width={dimension}
                                height={dimension}
                                id={`imageList-${Component[type]}-${id}-${label}-new`}
                                onChangeEvent={(value: any) => {
                                    if (value) {
                                        onChange([...overrideListValue, value]);
                                    }
                                }} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
