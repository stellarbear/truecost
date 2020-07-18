import React, {createContext, useState} from "react";
import {createStyles, Fade, IconButton, makeStyles, Snackbar, Theme} from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import {colors} from "theme";

//  https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
const NotificationContext = createContext({
    message: "",
    notify: (_: string): void => {
    },
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: colors.primaryColor,
        },
    }),
);

interface NotifyProps {
    children: JSX.Element;
    timeout?: number;
}

const NotifyWrapper: React.FC<NotifyProps> = ({children, timeout = 4096}): JSX.Element => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const notify = (message: string): void => {
        setMessage(message);
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const renderSnackBar = (): JSX.Element => {
        return (
            <Snackbar
                style={{marginTop: 80, backgroundColor: colors.primaryColor}}
                ContentProps={{
                    classes: {
                        root: classes.root,
                    },
                }}
                autoHideDuration={timeout}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
                open={open}
                message={message}
                onClose={handleClose}
                TransitionComponent={Fade}
                action={(
                    <IconButton
                        key='close'
                        aria-label='Close'
                        color='inherit'
                        onClick={handleClose}
                    >
                        <Close/>
                    </IconButton>
                )}
            />
        );
    };

    return (
        <NotificationContext.Provider value={{message, notify}}>
            <React.Fragment>
                {children}
                {renderSnackBar()}
            </React.Fragment>
        </NotificationContext.Provider>
    );
};

export {NotifyWrapper, NotificationContext};
