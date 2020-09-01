import * as React from "react";
import {Typography} from "@material-ui/core";
import {Col} from "./Grid";


interface IProps {
    text: string;
    description?: string;
}

export const TypographyTwoLevel: React.FC<IProps> = ({text, description}) => {
    const renderNormal = () => (
        <Typography align="center" variant="h6" color="inherit" noWrap>
            {text}
        </Typography>
    );

    const renderTwolevel = () => (
        <Col m={[-8, 0]}>
            <Typography align="center" variant="h6" color="inherit" noWrap>
                {text}
            </Typography>
            <Typography color="inherit" noWrap
                style={{
                    opacity: 0.5,
                    marginTop: -4,
                    fontSize: "0.8rem",
                }}>
                {description}
            </Typography>
        </Col>
    );

    return (
        !description
            ? renderNormal()
            : renderTwolevel()
    );
};
