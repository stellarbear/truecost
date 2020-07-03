import React, {useContext} from "react";
import {Avatar} from "@material-ui/core";
import {AccountBox} from "@material-ui/icons";
import {NotificationContext} from "./wrappers";

interface ISelectImageProps {
    id: string;
    ext?: string;
    width?: number;
    height?: number;
    size?: number;
    mock?: JSX.Element;
    src: string | null;
    onChangeEvent: (value: any) => void;
}

const SelectImage: React.FC<ISelectImageProps> = ({
                                                      mock = <AccountBox/>,
                                                      onChangeEvent,
                                                      height = 256,
                                                      width = 256,
                                                      size = 6 * 1024 * 1024,
                                                      ext,
                                                      src,
                                                      id,
                                                  }) => {

    const {notify} = useContext(NotificationContext);

    return (
        <div style={{height}}>
            <label
                htmlFor={`image-${id}`}
                style={{cursor: "pointer"}}>
                <Avatar style={{borderRadius: 10, width, height}}>
                    {
                        src
                            ? <img
                                style={{objectFit: "cover"}}
                                src={src}
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                }}
                                alt=""
                                width={width}
                                height={height}
                            />
                            : mock
                    }
                </Avatar>
            </label>
            <input
                accept="image/*"
                style={{display: "none"}}
                id={`image-${id}`}
                type="file"
                required
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.target.files) {
                        const file = event.target.files[0];
                        if (!file) {
                            onChangeEvent(null);
                        }
                        if (file.size > size) {
                            onChangeEvent(null);
                            notify(`size limit exceeded - ${size}`);
                        } else if (!ext || file.name.endsWith('.' + ext)) {
                            onChangeEvent(file);
                        } else {
                            onChangeEvent(null);
                            notify(`only ${ext} allowed`);
                        }
                    }
                }}/>
        </div>
    );
};

export default SelectImage;
