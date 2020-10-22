import * as React from 'react';
import {Button, ButtonBase, Card, Divider, Typography} from '@material-ui/core';
import {IBlog} from '@truecost/shared';
import {backend, frontend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';
import {Col} from 'pages/Base/Grid';
import {Link} from 'react-router-dom';

interface IProps {
    blog: Omit<IBlog, 'text'>;
}

export const BlogCard: React.FC<IProps> = (props) => {
    const {blog: {id, images, name, preview, url}} = props;

    const [raised, setRaised] = React.useState(false);

    const image = images.length > 0
        ? `${backend.uri}/${id}/${images[0]}/u.png`
        : `${frontend.uri}/default/assistant.png`;

    return (
        <Card
            style={{
                position: "relative",
                cursor: "pointer",
            }}
            onMouseOver={() => setRaised(true)}
            onMouseOut={() => setRaised(false)}
            raised={raised}
        >
            <ButtonBase
                component={Link}
                to={`/post/${url}`}>

                <Col s={8} p={8}>
                    <SafeImage
                        alt={"blog image"}
                        height={250}
                        src={image} style={{
                            minWidth: 250,
                            width: 250, height: 250, objectFit: "cover", margin: 8, marginLeft: 0,
                        }} />
                    <Typography
                        variant="h5" component="h2">{name}</Typography>
                    <Divider />
                    <div style={{
                        position: "relative",
                    }}>
                        <Typography style={{
                            opacity: 0.7,
                            height: 160,
                            overflow: "hidden",
                        }}>{preview}</Typography>
                        <div style={{
                            position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
                            background: "linear-gradient(to bottom, " +
                                "rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
                        }} />
                    </div>
                    <Button
                        color={!raised ? "default" : "primary"}
                        variant="contained">Read more</Button>
                </Col>
            </ButtonBase>
        </Card>
    );
};
