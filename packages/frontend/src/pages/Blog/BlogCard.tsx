import * as React from 'react';
import {Button, Card, Typography} from '@material-ui/core';
import {IBlog} from '@truecost/shared';
import {backend, frontend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';
import {Col, Row} from 'pages/Base/Grid';
import {Link} from 'react-router-dom';

interface IProps {
    blog: Omit<IBlog, 'text'>;
}

export const BlogCard: React.FC<IProps> = (props) => {
    const {blog: {id, images, name, preview, date, url}} = props;

    const image = images.length > 0
        ? `${backend.uri}/${id}/${images[0]}/u.png`
        : `${frontend.uri}/default/assistant.png`;

    return (
        <Card>
            <Row fullWidth start
                 style={{alignItems: "normal"}}
                 width={["auto", "100%"]}
                 m={8} s={8}>
                <SafeImage
                    alt={"blog image"}
                    height={160}
                    src={image} style={{
                    minWidth: 160,
                    width: 160, height: 160, objectFit: "cover", margin: 8, marginLeft: 0,
                }}/>
                <Col fullWidth
                     style={{justifyContent: "space-between", height: "100%"}}
                >
                    <Col left>
                        <Typography variant="h5" component="h2">{name}</Typography>
                        <Typography style={{opacity: 0.7}}>{preview}</Typography>
                    </Col>
                    <Row fullWidth between s={8}>
                        <Typography>{new Date(date).toLocaleDateString()}</Typography>
                        <Button variant="contained"
                                component={Link} to={`/post/${url}`}>Read more</Button>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};
