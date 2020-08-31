import * as React from 'react';
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
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundImage: "url(" + src + ")",
        }}
    />
);