import React, {useEffect, useState} from "react";
import {IconButton} from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import CircleIcon from '@material-ui/icons/FiberManualRecord';
import {colors} from "theme";

interface ICarouselProps {
    infinite?: boolean;
    arrows?: boolean;
}

const Carousel: React.FC<ICarouselProps> = ({
    children,
    arrows = true,
    infinite = false,
}) => {
    const [data, setData] = React.useState<React.ReactNode[]>([]);
    const slide = React.useRef<HTMLDivElement | null>(null);
    const [current, setCurrent] = useState(0);
    const [touchX, setTouchX] = useState<number | null>(null);
    const [moveX, setMoveX] = useState<number | null>(null);

    useEffect(() => {
        const validChildren: React.ReactNode[] = Array.isArray(children) ? children.flatMap(c => c) : [children].filter(c => c);
        setData(validChildren);
        /*
                let elemt = document.getElementById("slide");
                if (elemt) {
                    elemt.addEventListener('touchstart', dragStart);
                    elemt.addEventListener('touchend', dragEnd);
                    elemt.addEventListener('touchmove', dragMove);

                    function dragStart(e: any) {
                        console.log(e);
                    }

                    function dragMove(e: any) {
                        console.log(e);
                    }

                    function dragEnd(e: any) {
                        console.log(e);
                    }
                }
        */
    }, [children]);

    const onRight = () => setCurrent(
        current < data.length - 1
            ? current + 1
            : infinite ? 0 : current);

    const onLeft = () => setCurrent(
        current > 0
            ? current - 1
            : infinite ? data.length - 1 : current);

    const onIndex = (index: number) => setCurrent(index);

    const disabledRight = infinite ? false : current == data.length - 1;
    const disabledLeft = infinite ? false : current == 0;

    if (data.length < 1) {
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

    const buildCarousel = () => {
        const color = "rgba(0,0,0,0.9)";
        const background = "rgba(0,0,0,0.1)";
        const width = slide.current?.offsetWidth ?? 0;

        return (
            <div style={{
                display: "flex", alignItems: "center", position: "relative",
                overflow: "hidden", width: "100%", maxHeight: "inherit",
            }}>
                {data.length > 1 && (
                    <React.Fragment>
                        {arrows &&
                            <IconButton disabled={disabledLeft}
                                style={{
                                    position: "absolute", left: 8, zIndex: 9,
                                    background,
                                }}
                                onClick={() => onLeft()}>
                                <ChevronLeft />
                            </IconButton>
                        }
                    </React.Fragment>
                )}
                <div
                    id="slide"
                    ref={slide}
                    onTouchStart={(e) => setTouchX(e.touches?.[0]?.clientX ?? null)}
                    onTouchMove={(e) => setMoveX(e.touches?.[0]?.clientX ?? null)}
                    onTouchEnd={(e) => onMove()}
                    style={{
                        display: "flex",
                        width: "100%",
                        transform: `translateX(${-width * current}px)`,
                        transition: 'transform ease-out 0.45s',
                    }}>
                    {
                        data.map((image, i) => (
                            <div key={`image-${i}`} style={{minWidth: "100%"}}>
                                {image}
                            </div>
                        ))
                    }
                </div>
                {data.length > 1 && (
                    <React.Fragment>
                        {arrows &&
                            <IconButton disabled={disabledRight}
                                style={{
                                    position: "absolute", right: 8, zIndex: 9,
                                    background,
                                }}
                                onClick={() => onRight()}>
                                <ChevronRight />
                            </IconButton>
                        }
                        <div style={{
                            padding: 4,
                            backgroundColor: "white",
                            borderRadius: 20,
                            display: "flex", left: "50%", color,
                            transform: "translateX(-50%)", zIndex: 10, position: "absolute", bottom: 8,
                            alignItems: "center",
                        }}>
                            {data.map((entry, index) =>
                                <CircleIcon
                                    style={{
                                        transform: index == current ? "scale(1.5)" : "scale(1.0)",
                                        color: index == current ? colors.accentColor : "black",
                                        cursor: "pointer",
                                        transition: "all .2s",
                                        padding: 2,
                                        //padding: index == current ? "0px 4px 0px 4px" : 0,
                                    }}
                                    fontSize="small"
                                    key={`carousel-control-${index}`}
                                    onClick={() => onIndex(index)} />,
                            )}
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    };

    return (
        <React.Fragment>
            {buildCarousel()}
        </React.Fragment>
    );
};

export default Carousel;
