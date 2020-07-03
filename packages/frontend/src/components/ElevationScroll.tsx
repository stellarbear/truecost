import React from "react";
import {useScrollTrigger} from "@material-ui/core";

interface IElevationScrollProps {
    elevation?: number;
}

const ElevationScroll: React.FC<IElevationScrollProps> = ({
                                                              children,
                                                              elevation = 4,
                                                          }) => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return React.cloneElement(children as React.ReactElement<any>, {
        elevation: trigger ? elevation : 0,
    });
};

export default ElevationScroll;
