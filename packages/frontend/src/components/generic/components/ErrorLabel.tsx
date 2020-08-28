import {Typography} from "@material-ui/core";
import * as React from "react";
import {useState} from "react";

interface IProps {
    error?: string;
}

const ErrorLabel: React.FC<IProps> = (props) => {
    const {error, children} = props;
    const [show, setShow] = useState(true);

    return (
        <div style={{position: 'relative'}}
             onMouseEnter={() => setShow(false)}
             onMouseLeave={() => setShow(true)}
        >
            {children}
            {error && (<Typography
                    style={{
                        visibility: show ? "visible" : 'hidden',
                        animation: "all 0.2s",
                        position: 'absolute', width: '100%', height: '100%',
                        left: 0, top: 0,
                        color: "red",
                        backgroundColor: " #FFFFFFDD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                    }}
                    component="div"
                    variant="caption">
                    {error}
                </Typography>
            )}
        </div>
    );
};

export default ErrorLabel;
