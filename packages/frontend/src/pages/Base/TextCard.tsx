import React from "react";
import {createStyles, Divider, makeStyles, Theme, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            maxWidth: 1600 - 16 * 2,
            flexDirection: "row",
            [theme.breakpoints.down(658)]: {
                margin: "0px 10px 0px",
                flexDirection: "column",
            },
            [theme.breakpoints.up(658)]: {
                margin: "0px 30px 0px",
            },
            [theme.breakpoints.up(1600)]: {
                margin: "0px auto 0px",
            },
        },
        font: {
            marginTop: 4,
        },
    }),
);

interface ITextCardProps {
    title: string;
    data: {
        title: string | null;
        text: string;
    }[];
}

const TextCard: React.FC<ITextCardProps> = ({title, data, children}): JSX.Element => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.margin}
                 style={{
                     display: "flex",
                     flexDirection: "column",
                     justifyContent: "space-between",
                     padding: "0px 16px 16px",
                     borderRadius: 6,
                     zIndex: 3,
                     overflow: "hidden",
                 }}>
                <Typography variant="h4"
                            style={{textAlign: "left", marginTop: 16, marginBottom: 16}}>{title}</Typography>
                <Divider/>
                {
                    data.map(({title, text}, i) => (
                        <div key={`block-${i}`}>
                            <Typography variant="h6" style={{marginTop: 16}}>{title}</Typography>
                            {text.split('\n').filter(c => c.length > 0).map((block, j) => (
                                <Typography className={classes.font} variant="body2"
                                            key={`block-${i}-p-${j}`}> {block}</Typography>
                            ))}
                        </div>
                    ))
                }
                {children}
            </div>
        </React.Fragment>
    );
};

export default TextCard;
