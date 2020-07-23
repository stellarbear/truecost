import * as React from "react";
import {ABase, IRender, ICtor} from "./ABase";
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import AddBox from '@material-ui/icons/AddBox'
import {NumericField} from "../components/NumericField";
import RangeField from "../components/RangeField";
import {Col, Row} from "pages/Base/Grid";
import {Badge} from "@material-ui/core";
import SelectImage from "components/generic/components/SelectImage";
import {Zoom} from "components";
import {serverUri} from "auxiliary/route";

export interface IImage extends ICtor<any> {
    limit?: number;
    size?: number;
    ext: string;
}

export class CImage extends ABase<any> {
    limit: number;
    size: number;
    ext: string;

    constructor({limit = 0, size = 6 * 1024 * 1024, ext, ...rest}: IImage) {
        super(rest);
        this.size = size;
        this.limit = limit;
        this.ext = ext;
    }

    renderAddImplementation = this.ImageList;
    renderFilterlementation = this.NoControl;
    renderListlementation = this.ImageList;


    ImageList({value, onChange, id}: IRender<any>) {
        const {label, base} = this.data;
        const {limit, ext, size} = this;
        const dimension = 64;

        const images: File | string[] = Array.isArray(value) ? value : [];

        //TODO: refactor
        return (
            <Row p={8} style={{
                overflowX: "auto",
                overflowY: "hidden",
                maxWidth: 300,
                flexWrap: "nowrap",
            }}>
                {
                    (images).map((val: any, index: number) => {
                        const imageSrc = (typeof val != "string")
                            ? URL.createObjectURL(val)
                            : id
                                ? `${serverUri}/${id}/${val}/u.${ext}`
                                : null;


                        return (
                            <div key={`${id}-${index}-list`}>
                                <Badge
                                    badgeContent={
                                        <RemoveCircle
                                            onClick={() => onChange([...images.filter(v => v != val)])}
                                            style={{width: 16, height: 16, marginLeft: -4, marginRight: -4}}/>
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
                                            id={`${id}-${label}-${index}`}
                                            src={imageSrc}
                                            onChangeEvent={(value: any) => {
                                                const newList = [...images];
                                                newList[index] = value;
                                                onChange(newList);
                                            }}/>
                                    </Zoom>
                                </Badge>
                            </div>
                        );
                    })
                }
                {(limit === 0 || images.length < limit) && (
                    <div key={`${id}-new`}>
                        <SelectImage
                            ext={ext}
                            size={size}
                            src={null}
                            mock={<AddBox/>}
                            width={dimension}
                            height={dimension}
                            id={`${id}-${label}-new`}
                            onChangeEvent={(value: any) => {
                                if (value) {
                                    onChange([...images, value]);
                                }
                            }}/>
                    </div>
                )}
            </Row>
        );
    }
}
