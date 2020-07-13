import * as React from "react";
import {CircularProgress, createStyles, IconButton, makeStyles, Theme, Tooltip} from "@material-ui/core";
import {IconButtonProps} from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        outer: {
            height: 40,
            padding: 4,
            position: "relative",
        },
        inner: {
            top: 0,
            left: 0,
            position: "absolute",
        },
    }),
);

interface Props extends IconButtonProps {
    tooltip?: string;
    timeout?: number;
    onClickEvent: (() => void);
    icon: JSX.Element;
}

const TimeoutButton: React.FC<Props> = ({
                                            icon,
                                            timeout = 5,
                                            tooltip = undefined,
                                            onClickEvent,
                                            ...rest
                                        }) => {
    const classes = useStyles();
    const [progress, setProgress] = React.useState<number>(0);
    const [incrementTimerID, setIncrementTimerID] = React.useState<NodeJS.Timeout>();
    const [decrementTimerID, setDecrementTimerID] = React.useState<NodeJS.Timeout>();

    const clearDecrement = (timerID = decrementTimerID) => {
        if (timerID) {
            global.clearInterval(timerID);
            setDecrementTimerID(undefined);
        }
    };

    const clearIncrement = (timerID = incrementTimerID) => {
        if (timerID) {
            global.clearInterval(timerID);
            setIncrementTimerID(undefined);
        }
    };

    const decrement = () => {
        let value = progress;
        clearIncrement();

        if (value == 0) {
            return;
        }

        const timer = global.setInterval(() => {
            setProgress(--value);

            if (value <= 0) {
                clearDecrement(timer);
            }
        }, 128);
        setDecrementTimerID(timer);
    };

    const increment = () => {
        let value = progress;
        clearDecrement();

        const timer = global.setInterval(() => {
            setProgress(++value);

            if (value >= timeout) {
                onClickEvent();

                clearIncrement(timer);
                setProgress(0);
            }
        }, 1000);
        setIncrementTimerID(timer);
    };

    return (
        <div className={classes.outer}>
            <CircularProgress variant="static" value={progress * 100 / timeout}/>
            <div className={classes.inner}>
                {tooltip && (
                    <Tooltip title={tooltip}>
                        <IconButton
                            {...rest}
                            onMouseDown={() => increment()}
                            onMouseUp={() => decrement()}>
                            {icon}
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};

export default TimeoutButton;
