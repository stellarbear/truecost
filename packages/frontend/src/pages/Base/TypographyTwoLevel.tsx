import * as React from "react";
import {CSSProperties} from "react";
import {Typography} from "@material-ui/core";
import {Col} from "./Grid";


interface IProps {
    text: string;
    description?: string;
    style?: CSSProperties;
    styleUp?: CSSProperties;
    styleDown?: CSSProperties;
}

export const TypographyTwoLevel: React.FC<IProps> = (props) => {
    const {text, description, styleUp = {}, styleDown = {}, style = {}} = props;
    const renderNormal = () => (
        <Typography style={style} align="center" variant="h6" color="inherit" noWrap>
            {text}
        </Typography>
    );

    const renderTwolevel = () => (
        <Col style={style} m={[-8, 0]} align="center">
            <Typography align="center" variant="h6" color="inherit" noWrap
                style={{...styleUp}}>
                {text}
            </Typography>
            <Typography color="inherit" noWrap
                style={{
                    opacity: 0.5,
                    marginTop: -4,
                    fontSize: "0.8rem",
                    ...styleDown,
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
