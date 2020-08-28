import * as React from "react";
import {makeStyles} from "@material-ui/styles";
import {Backdrop, Badge, createStyles, Fade, Modal, Paper} from "@material-ui/core";
import ZoomOutMap from "@material-ui/icons/ZoomOutMap";
import {BadgeProps} from "@material-ui/core/Badge";

const useStyles = makeStyles(() =>
    createStyles({
        root: {},
        modal: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        badge: {
            cursor: "pointer",
        },
        badgeIcon: {
            width: 16,
            height: 16,
            marginLeft: -4,
            marginRight: -4,
        },
        big: {
            maxWidth: 600,
            maxHeight: 600,
        },
    }),
);

interface IZoom extends BadgeProps {
    smallProps?: any;
    bigProps?: any;
    children: React.ReactNode;
}

const Zoom: React.FC<IZoom> = (props) => {
    const {
        smallProps = {},
        bigProps = {},
        children,
    } = props;
    const classes = useStyles();
    const [showLightBox, setShowLightBox] = React.useState<boolean>(false);

    const onBadgeClick = () => {
        setShowLightBox(true);
    };

    const buildSmall = () => {
        return (
            <Badge
                color="primary"
                className={classes.badge}
                badgeContent={
                    <ZoomOutMap
                        onClick={() => onBadgeClick()}
                        className={classes.badgeIcon}/>
                }
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}>
                {React.cloneElement(children as React.ReactElement<any>, smallProps)}
            </Badge>
        );
    };

    const buildLightBox = () => {
        return (
            <Modal
                className={classes.modal}
                open={showLightBox}
                onClose={() => setShowLightBox(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{timeout: 500}}>
                <Fade in={showLightBox}>
                    <Paper>
                        <div className={classes.big}>
                            {React.cloneElement(children as React.ReactElement<any>, bigProps)}
                        </div>
                    </Paper>
                </Fade>
            </Modal>
        );
    };

    return (
        <React.Fragment>
            {buildSmall()}
            {buildLightBox()}
        </React.Fragment>
    );
};

export default Zoom;
