import React, {useState} from "react";
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
import {copyToClipboard} from "auxiliary";
import {TransitionProps} from "@material-ui/core/transitions/transition";
import {Close} from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Grow in ref={ref} {...props} />;
});

interface ISocialDialogProps {
    button: JSX.Element;
    title: string;
    icon: JSX.Element;
    url: string;
    valid: boolean;
}

const SocialDialog: React.FC<ISocialDialogProps> = ({
                                                        button,
                                                        valid,
                                                        title,
                                                        icon,
                                                        url,
                                                    }): JSX.Element => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            {React.cloneElement(button, {onClick: () => setOpen(true)})}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                TransitionComponent={Transition}
            >
                <DialogTitle style={{padding: 8}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <div>
                            <IconButton color="inherit" size="medium">
                                {icon}
                            </IconButton>
                            {title}
                        </div>
                        <IconButton onClick={() => setOpen(false)} style={{marginLeft: 32}}>
                            <Close/>
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent style={{padding: "0px 16px 8px"}}>
                    <Typography style={{minWidth: 160, textAlign: "center"}}>{url}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => copyToClipboard(url)} color="primary">
                        Copy
                    </Button>
                    {valid && (
                        <a href={url} target="_blank" style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}>
                            <Button color="primary" variant="contained">
                                Open link
                            </Button>
                        </a>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SocialDialog;
