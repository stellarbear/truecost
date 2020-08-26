import React, {useState, useRef} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grow,
    IconButton,
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

interface IProps {
    button: JSX.Element;
    title?: string
    content?: JSX.Element[];
    actions?: JSX.Element[];
}

export const ModalDialog: React.FC<IProps> = (props) => {
    const {
        title,
        button,
        content = [],
        actions = []
    } = props;
    const [open, setOpen] = useState(false);

    return (
        <div>
            {React.cloneElement(button, {onClick: () => setOpen(true)})}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                TransitionComponent={Transition}
            >
                {title && (
                    <DialogTitle style={{padding: 8}}>
                        <Row fullWidth between>
                            <Typography>{title}</Typography>
                            <IconButton onClick={() => setOpen(false)} style={{marginLeft: 32}}>
                                <Close />
                            </IconButton>
                        </Row>
                    </DialogTitle>
                )}
                <DialogContent>
                    {
                        content
                    }
                </DialogContent>
                {actions.length > 0 && (
                    <DialogActions>
                        {actions}
                    </DialogActions>
                )}
            </Dialog>
        </div>
    );
}
