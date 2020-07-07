import React from "react";
import window from 'global';
import {createStyles, makeStyles, Theme} from "@material-ui/core";

interface ParallaxProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    image: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        height: {
            [theme.breakpoints.down(658)]: {
                height: "100vh",
            },
            [theme.breakpoints.up(658)]: {
                height: "90vh",
            },
        },
    }),
);

const Parallax: React.FC<ParallaxProps> = (props) => {
    const {
        children,
        image,
    } = props;
    const classes = useStyles();
    const [transform, setTransform] = React.useState(
        "translate3d(0," + (window.pageYOffset / 3) + "px,0)",
    );

    React.useEffect(() => {
        window.addEventListener("scroll", resetTransform);

        return function cleanup() {
            window.removeEventListener("scroll", resetTransform);
        };
    });

    const resetTransform = () => {
        const windowScrollTop = window.pageYOffset / 3;
        setTransform("translate3d(0," + windowScrollTop + "px,0)");
    };

    /*const { filter, className, style, small } = props;
    const classes = useStyles();
    const parallaxClasses = classNames({
        [classes.parallax]: true,
        [classes.filter]: filter,
        [classes.small]: small,
        [className]: className !== undefined
    });*/
    return (
        <div
            className={classes.height}
            style={{
                zIndex: -10,
                top: 0, left: 0, right: 0,
                width: "100vw",
                maxHeight: "1000px",
                overflow: "hidden",
                position: "absolute",
                backgroundPosition: "center center",
                backgroundSize: "cover",
                margin: "0",
                padding: "0",
                border: "0",
                display: "flex",
                alignItems: "center",
                backgroundImage: "url(" + image + ")",
                transform: transform,
                //boxShadow: "0 0 8px 8px #fff inset"
            }}
        >
            {children}
        </div>
    );
};

export default Parallax;
