import React, {useState, ReactNode} from "react";
import {IconButton} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import {SafeImage} from "./SafeImage";
import {CSSProperties} from "@material-ui/core/styles/withStyles";
import {Row, Col} from "pages/Base/Grid";

interface IPropsString {
    alt: string;
    infinite?: boolean;
    children: string[];
}

interface IPropsNode {
    infinite?: boolean;
    children: ReactNode[];
}

type IProps = IPropsString | IPropsNode;

const arrowStyle: CSSProperties = {
    position: "absolute",
    top: "40%",
    zIndex: 2,
    background: "#FFFFFFDD",
};

export const Carousel: React.FC<IProps> = (props) => {
    const {
        children,
        infinite = true,
    } = props;

    const [current, setCurrent] = useState(0);
    const [touchX, setTouchX] = useState<number | null>(null);
    const [moveX, setMoveX] = useState<number | null>(null);

    const onRight = () => setCurrent(
        current < children.length - 1
            ? current + 1
            : infinite ? 0 : current);

    const onLeft = () => setCurrent(
        current > 0
            ? current - 1
            : infinite ? children.length - 1 : current);

    const onIndex = (index: number) => setCurrent(index);

    const disabledRight = infinite ? false : current == children.length - 1;
    const disabledLeft = infinite ? false : current == 0;

    if (children.length < 1) {
        return null;
    }

    const onMove = () => {
        if (touchX !== null && moveX !== null) {
            if (moveX > touchX) {
                onLeft();
            } else {
                onRight();
            }
        }
        setTouchX(null);
        setMoveX(null);
    };

    const arrows = () => children.length > 1 && (
        <>
            <IconButton
                style={{
                    ...arrowStyle,
                    left: 8,
                }}
                disabled={disabledLeft}
                onClick={() => onLeft()}>
                <ArrowBack />
            </IconButton>
            <IconButton
                style={{
                    ...arrowStyle,
                    right: 8,
                }}
                disabled={disabledRight}
                onClick={() => onRight()}>
                <ArrowForward />
            </IconButton>
        </>
    );

    const dots = () => children.length > 1 && (
        <Row>
            {
                (children as any[]).map((_, index) => (
                    <FiberManualRecord
                        style={{
                            cursor: "pointer",
                            opacity: index == current ? 1.0 : 0.6,
                            transition: "all .2s",
                        }}
                        key={index}
                        onClick={() => onIndex(index)} />
                ))
            }
        </Row>
    );

    const view = () => (
        Array.isArray(children) && children.every(item => typeof item === "string")
            ? (
                <SafeImage
                    alt={`${(props as any).alt} carousel ${current + 1} slide`}
                    onTouchStart={(e) => setTouchX(e.touches?.[0]?.clientX ?? null)}
                    onTouchMove={(e) => setMoveX(e.touches?.[0]?.clientX ?? null)}
                    onTouchEnd={() => onMove()}
                    draggable="false"
                    style={{objectFit: "cover", width: "100%"}}
                    src={children[current] as string} />
            ) : (
                children[current] && React.isValidElement(children[current]) &&
                React.cloneElement(children[current] as any, {
                    onTouchStart: (e) => setTouchX(e.touches?.[0]?.clientX ?? null),
                    onTouchMove: (e) => setMoveX(e.touches?.[0]?.clientX ?? null),
                    onTouchEnd: () => onMove(),
                })
            )
    );

    return (
        <Col style={{position: "relative"}}>
            {view()}
            {arrows()}
            {dots()}
        </Col>
    );
};
