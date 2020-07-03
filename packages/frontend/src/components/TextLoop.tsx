import React from "react";
import {Typography, TypographyProps} from "@material-ui/core";
import Loop from "react-text-loop";

interface ITextLoopProps extends TypographyProps {
    prefix: string;
    loop: string[];
    suffix: string;
}

const TextLoop: React.FC<ITextLoopProps> = ({
                                                prefix,
                                                suffix,
                                                loop,
                                                ...rest
                                            }) => {
    return (
        <React.Fragment>
            <Typography {...rest} color="inherit" style={{whiteSpace: "pre"}}>{`${prefix} `} </Typography>
            <Loop>
                {loop.map(i => <Typography {...rest} style={{whiteSpace: "pre"}} key={i}>{`${i} `}</Typography>)}
            </Loop>
            <Typography {...rest} color="inherit" variant="h4" style={{whiteSpace: "pre"}}>{`${suffix}`}</Typography>
        </React.Fragment>
    );
};

export default TextLoop;
