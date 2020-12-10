import React, {createContext, useState} from "react";
import {
    Container, Dialog,
    DialogActions, DialogContent,
    DialogTitle, Grow, IconButton,
    Typography,
} from "@material-ui/core";
import {TransitionProps} from "@material-ui/core/transitions/transition";
import Close from "@material-ui/icons/Close";
import {Row} from "pages/Base/Grid";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {children?: React.ReactElement<any, any>},
    ref: React.Ref<unknown>,
) {
    return <Grow in ref={ref} {...props} />;
});

export interface IContext {
    toggle: () => void;
}

const ModalContext = createContext({} as IContext);

interface IProps {
    button: JSX.Element;
    title?: string;
    content?: JSX.Element[];
    actions?: JSX.Element[];
    onOpen?: () => void;
}

export const ModalDialog: React.FC<IProps> = (props) => {
    const {
        title,
        button,
        content = [],
        actions = [],
        onOpen = () => { },
    } = props;
    const [open, setOpen] = useState(false);

    return (
        <ModalContext.Provider value={{
            toggle: () => setOpen(!open),
        }}>
            {React.cloneElement(button, {
                onClick: () => {
                    setOpen(true);
                    onOpen();
                },
            })}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                TransitionComponent={Transition}
            >
                <Container maxWidth="xs" style={{padding: 0}}>
                    <DialogTitle style={{
                        padding: 8,
                        marginBottom: !title ? -48 : 0,
                    }}>
                        <Row justify="space-between">
                            <Typography>{title || ""}</Typography>
                            <IconButton
                                onClick={() => setOpen(false)}
                                style={{marginLeft: 32}}>
                                <Close />
                            </IconButton>
                        </Row>
                    </DialogTitle>
                    <DialogContent>
                        {content}
                    </DialogContent>
                    {actions.length > 0 && (
                        <DialogActions>
                            {actions}
                        </DialogActions>
                    )}
                </Container>
            </Dialog>
        </ModalContext.Provider>
    );
};

export const useModalToggle = () => React.useContext(ModalContext);
