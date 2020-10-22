import * as React from 'react';

import {gql, useQuery} from '@apollo/client';
import {Redirect, useLocation, useParams} from 'react-router';
import {Meta} from 'pages/Base/Meta';
import {IBlog} from '@truecost/shared';
import {Col} from 'pages/Base/Grid';
import {Link} from 'react-router-dom';
import {ArrowBack} from '@material-ui/icons';
import {Button, CircularProgress, Divider, Typography} from '@material-ui/core';
import {backend, frontend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';
import Markdown from 'markdown-to-jsx';

const GET_BLOG = gql`
    query BlogUrl ($url: String!) {
        BlogUrl (url: $url) {
            id
            name
            url
            date
            active
            images
            text
        }
    }
`;

export const BlogPost: React.FC = () => {
    const location = useLocation();
    const {id: url} = useParams<{id: string}>();
    const {data, error, loading} = useQuery(GET_BLOG, {variables: {url}});

    if (error || loading) {
        return <CircularProgress />;
    }

    const blog: IBlog | undefined = data?.BlogUrl;

    if (!blog) {
        return <Redirect to="/404" />;
    }

    const {images, text, name, id} = blog;

    const image = images.length > 0
        ? `${backend.uri}/${id}/${images[0]}/u.png`
        : `${frontend.uri}/default/assistant.png`;

    const date = new Date(new Date().getFullYear() + 1, 0, 1).toJSON().slice(0, 10);
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${frontend.uri}${location.pathname}`,
        },
        "headline": `${name}`,
        "image": `${image}`,
        "author": {
            "@type": "Person",
            "name": "Author",
        },
        "publisher": {
            "@type": "Organization",
            "name": "TrueCost",
            "logo": {
                "@type": "ImageObject",
                "url": "https://truecost.gg/logo-black.png",
            },
        },
        "datePublished": `${date}`,
        "dateModified": `${date}`,
    };

    return (
        <>
            <Meta entity={blog}>
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            </Meta>
            <Col s={8} align="flex-start">
                <Button
                    component={Link}
                    to="/blog"
                    startIcon={< ArrowBack />}
                >
                    To the blog
                </Button>
                <SafeImage
                    alt={"blog image"}
                    height={300}
                    src={image} style={{
                        minWidth: 300,
                        width: 300, height: 300, objectFit: "cover", marginLeft: 0,
                    }} />
                <Typography variant="h4" component="h1">{name}</Typography>
                <Divider style={{width: "100%"}}/>
                <Markdown style={{opacity: 0.7}}>
                    {text}
                </Markdown>
            </Col>
        </>
    );
};
