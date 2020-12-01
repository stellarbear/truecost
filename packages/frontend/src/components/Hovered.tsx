import * as React from 'react';

interface IProps {
    style?: React.CSSProperties;
}

export const Hovered: React.FC<IProps> = (props) => {
    const {children, style} = props;
    const [hovered, setHovered] = React.useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: hovered ? "rgba(0, 0, 0, 0.05)" : "transparent",
                transition: "all 0.3s", cursor: "pointer",
                ...style,
            }}
        >
            {children}
        </div>
    );
};