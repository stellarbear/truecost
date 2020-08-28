import React from "react";
import {Avatar} from "@material-ui/core";
import AccountBox from "@material-ui/icons/AccountBox";
import {useNotification} from "components/wrappers/NotifyWrapper";

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

const SelectImage: React.FC<ISelectImageProps> = (props) => {
    const {
        mock = <AccountBox/>,
        onChangeEvent,
        height = 256,
        width = 256,
        size = 6 * 1024 * 1024,
        ext,
        src,
        id,
    } = props;

    const {notify} = useNotification();

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
                                onError={() => {
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
                            return;
                        }
                        if (file.size > size) {
                            notify(`size limit exceeded - ${size}`);
                            return;
                        } else if (!ext || file.name.endsWith('.' + ext)) {
                            onChangeEvent(file);
                        } else {
                            notify(`only ${ext} allowed`);
                            return;
                        }
                    }
                }}/>
        </div>
    );
};

export default SelectImage;
