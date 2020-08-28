import React, {useRef, useState} from "react";
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

const SocialDialog: React.FC<ISocialDialogProps> = (props) => {
    const {
        button,
        valid,
        title,
        icon,
        url,
    } = props;
    const [open, setOpen] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const onCopy = () => {
        if (textAreaRef?.current) {
            textAreaRef.current.select();
            document.execCommand('copy');
            //setOpen(false);
        }
    };

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
                    <textarea
                        style={{opacity: 0}}
                        readOnly
                        ref={textAreaRef}
                        value={url}
                    />
                    {
                        typeof window !== 'undefined' && document.queryCommandSupported('copy') && (
                            <Button color="primary" onClick={onCopy} style={{marginLeft: 32}}>
                                Copy
                            </Button>
                        )
                    }
                    {valid && (
                        <a href={url} target="_blank" rel="noreferrer" style={{
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
