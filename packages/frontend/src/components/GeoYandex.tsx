import {GeolocationControl, GeoObject, Map, SearchControl, TypeSelector, YMaps} from "react-yandex-maps";
import React, {useEffect} from "react";


interface IMapInput {
    value?: any[];
    zoom?: number;
    width?: number;
    height?: number;
    tooltip?: string;
    center?: number[];
    onChangeEvent: (value: any) => void;
}

const GeoYandex: React.FC<IMapInput> = ({
                                            width = 256,
                                            height = 256,
                                            value = [0, 0],
                                            zoom: defaultZoom = 10,
                                            center: defaultCenter = [0, 0],
                                            tooltip: defaultTooltip = "Pin",
                                            onChangeEvent,
                                        }) => {

    const [center, setCenter] = React.useState<number[]>(defaultCenter);
    const [pin, setPin] = React.useState<number[]>(value);
    const [zoom, setZoom] = React.useState(defaultZoom);

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
        setPin([validate(value[0], 85), validate(value[1], 180)]);
    }, [value]);

    const onMapClick = (event: any) => {
        value = event.get("coords");
        setPin(value);
        onChangeEvent(value);
    };

    const onDragEnd = (event: any) => {
        value = event.get("target").geometry.getCoordinates();
        setPin(value);
        onChangeEvent(value);
    };

    const onMapChange = (event: any) => {
        setZoom(event.originalEvent.newZoom);
        setCenter(event.originalEvent.newCenter);
    };

    return (
        <YMaps query={{
            lang: "en_RU",
            apikey: "API_KEY",
            ns: "use-load-option",
            load: "Map,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon",
        }}>
            <Map
                state={{
                    zoom,
                    center,
                    controls: ["zoomControl", "fullscreenControl"],
                }}
                width={width}
                height={height}
                onClick={onMapClick}
                onBoundsChange={onMapChange}
                modules={["control.ZoomControl", "control.FullscreenControl", "geoObject.addon.balloon", "geoObject.addon.hint"]}>
                <GeoObject
                    // The geometry description.
                    geometry={{
                        type: "Point",
                        coordinates: pin,
                    }}
                    // Properties.
                    properties={{
                        // The placemark content.
                        tooltip: defaultTooltip,
                        hintContent: "Pull me",
                    }}
                    // Options.
                    options={{
                        // The placemark's icon will stretch to fit its contents.
                        preset: "islands#brownStretchyIcon",
                        // The placemark can be moved.
                        draggable: true,
                    }}
                    onDragEnd={onDragEnd}/>
                <GeolocationControl options={{float: "left"}}/>
                <SearchControl options={{float: "right"}}/>
                <TypeSelector options={{float: "right"}}/>
            </Map>
        </YMaps>
    );
};

export default GeoYandex;
