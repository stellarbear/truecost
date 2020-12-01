import * as React from 'react';
import {colors} from 'theme';

interface IProps {
    size?: number;
    color?: string;
}

export const Circle: React.FC<IProps> = (props) => {
    const {
        size = 12,
        color = colors.accentColor,
    } = props;

    return (
        <div style={{
            height: size,
            width: size,
            backgroundColor: color,
            borderRadius: "50%",
        }} />
    );
};