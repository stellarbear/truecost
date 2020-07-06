import React, {useContext, useEffect} from "react";
import {Button, CircularProgress, createStyles, Divider, makeStyles, Theme, Typography} from "@material-ui/core";
import {ArrowBack} from "@material-ui/icons";
import {CartContext} from "pages/Base/CartWrapper";
import {Link, Redirect, RouteComponentProps, withRouter} from "react-router-dom";
import {NotificationContext} from "components/wrappers";
import {gql} from "apollo-boost";
import {useLazyQuery} from "react-apollo";
import {imageUri} from "auxiliary/route";
import DefaultImage from "components/DefaultImage";
import Markdown from "components/Markdown";
import Meta from "./Base/Meta";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        size: {
            [theme.breakpoints.up(658)]: {
                width: 500,
                height: 500,
            },
            [theme.breakpoints.down(658)]: {
                width: 300,
                height: 300,
            },
        },
        margin: {
            maxWidth: 1600,
            [theme.breakpoints.down(658)]: {
                margin: "10px 10px 0px",
            },
            [theme.breakpoints.up(658)]: {
                margin: "30px 30px 0px",
            },
            [theme.breakpoints.up(1600)]: {
                margin: "30px auto",
            },
        },
    }),
);

const GET_POST = gql`
    query blogGetPost($id: String!) {
        blogGetPost(id: $id)
    }
`;


interface MatchParams {
    id: string;
}

type IBlogPostProps = RouteComponentProps<MatchParams>;

const BlogPost: React.FC<IBlogPostProps> = ({
                                                match: {params: {id}},
                                            }) => {
    const classes = useStyles();
    const {store: {postList}} = React.useContext(CartContext);
    const {notify} = useContext(NotificationContext);

    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
    const [related, setRelated] = React.useState<string[]>([]);
    const [selected, setSelected] = React.useState("");

    id = Object.keys(postList).filter(k => postList[k].url === id)?.[0];
    if (!id) {
        return <Redirect to="/blog"/>;
    }

    const {name, date} = postList[id];
    const [getBlogPostQuery, {called, loading, data}] =
        useLazyQuery(GET_POST);

    useEffect(() => {
        getBlogPostQuery({
            variables: {id},
        });
    }, []);

    const renderText = () => {
        if (loading || data == undefined) {
            return <CircularProgress/>;
        }

        const text = data.blogGetPost;
        if (!text) {
            return <Typography>Error occured. Please, try again later</Typography>;
        }

        return (
            <Markdown style={{opacity: 0.7, marginTop: 8}}>
                {text}
            </Markdown>
        );
    };

    return (
        <React.Fragment>
            <Meta page="post" props={{name}}/>
            <div
                className={classes.margin}
                style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <div style={{maxWidth: 900 + 16 * 2, width: "100%", display: "flex", flexDirection: "column"}}>
                    <Button
                        style={{
                            margin: "16px auto 16px 0px",
                        }}
                        component={Link}
                        to="/blog"
                        startIcon={< ArrowBack/>}
                    >
                        To the blog
                    </Button>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <DefaultImage key={`${id}-image`}
                                      srcSet={`${imageUri("blog", id, "img-300w")} 300w,
                                ${imageUri("blog", id, "img-600w")} 600w,
                                ${imageUri("blog", id, "img-1800w")} 1800w,`}
                                      sizes={`(max-width: 400px) 300px,
                                (max-width: 1000px) 600px,
                                1800px,`}
                                      src={imageUri("blog", id)}
                                      style={{objectFit: "cover", maxWidth: "100%", maxHeight: 300}}/>
                    </div>
                    <div style={{margin: 8}}>
                        <Typography variant="caption">{new Date(date).toLocaleDateString()}</Typography>
                        <Typography variant="h4">{name}</Typography>
                        <Divider style={{margin: "8px 0px"}}/>
                        {renderText()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default withRouter(BlogPost);
