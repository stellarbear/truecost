import React, {createContext, useContext, useState} from "react";
import {createStyles, Fade, IconButton, makeStyles, Snackbar} from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import {colors} from "theme";

export interface INotify {
    notify(message: string, meta?: Record<string, any>): void; 
}

const NotificationContext = createContext({} as INotify);

const useStyles = makeStyles(() =>
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

    const notify = (message: string, meta: Record<string, any> = {}): void => {
        setMessage(message + Object.keys(meta).map(key => `\n[${key}]: ${meta[key]}`));
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const renderSnackBar = (): JSX.Element => {
        return (
            <Snackbar
                style={{marginTop: 80, backgroundColor: colors.primaryColor, whiteSpace: "pre-wrap"}}
                ContentProps={{
                    classes: {
                        root: classes.root,
                    },
                }}
                autoHideDuration={timeout}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
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
        <NotificationContext.Provider value={{notify}}>
            <React.Fragment>
                {children}
                {renderSnackBar()}
            </React.Fragment>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);

export {NotifyWrapper, NotificationContext};
