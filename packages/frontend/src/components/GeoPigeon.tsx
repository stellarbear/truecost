import {Card, createStyles, makeStyles, Theme} from "@material-ui/core";
import React, {useEffect} from "react";
import Map from "pigeon-maps";
import Overlay from "pigeon-overlay";
import {Place} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        overlay: {
            width: 24,
            height: 24,
            transform: "translate(-12px, -24px)",
        },
        map: {},
    }),
);

interface IGeoPigeonProps {
    values?: [number, number][];
    selected?: number;
    width?: string | number;
    height?: string | number;
    zoom?: number;
    onMapClickEvent?: (value: any) => void;
    onPinClickEvent?: (value: any) => void;
}


const GeoPigeon: React.FC<IGeoPigeonProps> = ({
                                                  onPinClickEvent = () => {
                                                  },
                                                  onMapClickEvent = () => {
                                                  },
                                                  zoom: defaultZoom = 12,
                                                  selected = null,
                                                  values = [],
                                                  height = 400,
                                                  width = 800,
                                              }) => {
    const [center, setCenter] = React.useState<[number, number]>([0, 0]);
    const [pins, setPins] = React.useState<[number, number][]>(values);
    const [zoom, setZoom] = React.useState(defaultZoom);
    const classes = useStyles();

    const validate = (position: number, radius: number) => {
        if (position <= radius && position >= -radius) {
            return position;
        } else if (position > radius) {
            return position % (2 * radius) - radius;
        } else if (position < -radius) {
            return -((-position) % (2 * radius) + radius);
        } else {
            return radius;
        }
    };


    useEffect(() => {
        const validValues: [number, number][] =
            values.map(([lat, lng]) => [validate(lat, 85), validate(lng, 180)]);
        setPins(validValues);

        const count = values.length;
        if (count > 0) {
            const [latCenter, lngCenter] = validValues.reduce((prev, curr) => [prev[0] + curr[0], prev[1] + curr[1]]);
            setCenter([latCenter / count, lngCenter / count]);
        }
    }, [values]);

    useEffect(() => {
        if (selected && values && selected > 0 && values.length > selected) {
            //setCenter(values[selected]);
        }
    }, [selected]);

    const onMapClick = (event: any) => {
        onMapClickEvent(event.latLng);
    };
    const onPinClick = (index: number) => {
        onPinClickEvent(index);
    };

    const onMapChange = (event: any) => {
        setZoom(event.zoom);
        setCenter(event.center);
    };

    const wheelHandler = (e: any) => {
        const newZoom = (e.deltaY < 0) ? Math.min(zoom + 1, 18) : Math.max(zoom - 1, 1);
        setZoom(newZoom);
    };

    return (
        <Card
            onWheel={wheelHandler}
            style={{width, height}}>
            <Map
                zoom={zoom}
                center={center}
                attribution={false}
                onBoundsChanged={onMapChange}
                onClick={onMapClick}>
                {
                    pins.map((pin, index) =>
                        <Overlay anchor={pin} key={index} offset={[0, 0]}>
                            <div className={classes.overlay}>
                                <Place
                                    onClick={() => onPinClick(index)}
                                    style={{
                                        color: index == selected ? "#5D4037" : "black",
                                        cursor: "pointer",
                                    }}/>
                            </div>
                        </Overlay>)
                }
            </Map>
        </Card>
    );
};

export default GeoPigeon;
