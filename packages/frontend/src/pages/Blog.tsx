import React, {useState} from "react";
import {Button, createStyles, makeStyles, Theme, Typography} from "@material-ui/core";
import {CartContext} from "pages/Base/CartWrapper";
import DefaultImage from "components/DefaultImage";
import {baseGame, imageUri} from "auxiliary/route";
import {Link} from "react-router-dom";
import Meta from "./Base/Meta";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            position: "relative",
            zIndex: 5,
            maxWidth: 1600,
            boxShadow:
                "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
            [theme.breakpoints.down(658)]: {
                width: "calc(100% - 20px)",
                margin: "10px 10px 0px",
                flexDirection: "column",
            },
            [theme.breakpoints.up(658)]: {
                width: "calc(100% - 60px)",
                margin: "30px 30px 0px",
                flexDirection: "row",
            },
            [theme.breakpoints.up(1660)]: {
                margin: "30px auto 0px",
                flexDirection: "row",
            },
        },
        image: {
            width: 200,
            [theme.breakpoints.down(658)]: {
                width: "100%",
            },
        },
    }),
);

interface IBlogProps {
}

const Blog: React.FC<IBlogProps> = ({}) => {
    const classes = useStyles();
    const [hovered, setHovered] = useState("");
    const {store: {postList}} = React.useContext(CartContext);

    const renderPost = (id: string) => {
        const {name, preview, date, url} = postList[id];
        return (
            <div key={`post-${id}`}
                 style={{
                     borderRadius: "6px",
                     background: "#FFFFFF",
                     overflow: "hidden",
                     display: "flex",
                 }}
                 className={classes.margin}>
                <DefaultImage key={`${id}-image`}
                              className={classes.image}
                              srcSet={`${imageUri("blog", id, "img-300w")} 300w`}
                              src={imageUri("blog", id)} style={{objectFit: "cover", height: 200}}/>
                <div style={{
                    margin: 8,
                    width: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    <div>
                        <Typography variant="h5">{name}</Typography>
                        <Typography style={{opacity: 0.7, marginTop: 8}}>{preview}</Typography>
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}>
                        <Typography style={{bottom: 0}}>{new Date(date).toLocaleDateString()}</Typography>
                        <Button variant="contained"
                                component={Link} to={`/blog/${url}`}
                                style={{bottom: 0, right: 0}}>Read more</Button>
                    </div>
                </div>
            </div>
        );
    };

    const postIds = Object.keys(postList);
    if (postIds.length === 0) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 10,
            }}>
                <img className="float" style={{
                    minWidth: 80,
                    width: 80, height: 80, objectFit: "cover", margin: 8, marginLeft: 0,
                }} src={`/${baseGame}/pass.png`}/>
                <div style={{marginLeft: 8}}>
                    <Typography>Unfortunately, we haven't written anything yet</Typography>
                    <Typography>Try next time, hope you will find something interesting!</Typography>
                </div>
            </div>
        );
    }

    postIds.sort((a, b) => postList[b].date - postList[a].date);

    return (
        <div>
            <Meta page="blog"/>
            {postIds.map((id) => renderPost(id))}
        </div>
    );
};

export default Blog;
