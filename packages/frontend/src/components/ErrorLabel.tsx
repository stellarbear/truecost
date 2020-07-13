import {createStyles, makeStyles, Theme, Typography} from "@material-ui/core";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        outer: {
            width: "100%",
            textAlign: "center",
        },
        error: {
            whiteSpace: "nowrap",
            textAlign: "left",
            paddingLeft: 8,
            minHeight: 20,
            color: "red",
        },
    }),
);

interface IErrorLabelProps {
    error?: string;
}

const ErrorLabel: React.FC<IErrorLabelProps> = ({
                                                    error = "",
                                                    children,
                                                }) => {
    const classes = useStyles();

    return (
        <div className={classes.outer}>
            <div>
                {children}
            </div>
            <Typography
                component="div"
                className={classes.error}
                variant="caption">
                {error}
            </Typography>
        </div>
    );
};

export default ErrorLabel;
