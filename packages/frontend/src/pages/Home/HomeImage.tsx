import * as React from 'react';
import {SafeImage} from 'components/SafeImage';
interface IProps {
    src: string;
}

export const HomeImage: React.FC<IProps> = ({src}) => (
    <div
        style={{
            zIndex: -10,
            top: 0, left: 0, right: 0,
            height: "100vh",
            position: "absolute",
        }}
    >
        <SafeImage
            height={"inherit"}
            src={src} style={{objectFit: "contain", width: "inherit"}} />
    </div>
);