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
            <Col p={8}>
                <div style={{position: "relative"}}>
                    <SafeImage
                        alt={"blog image"}
                        height={250}
                        src={image} style={{
                            minWidth: 250,
                            width: 250, height: 250, objectFit: "cover", margin: 8, marginLeft: 0,
                        }} />
                    <Typography  
                style={{position:"absolute"}} 
                variant="h5" component="h2">{name}</Typography>
                </div>
                    <div style={{background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);"}}>
                <Typography style={{opacity: 0.7}}>{preview}</Typography>
                </div>
                <Button variant="contained"
                    component={Link} to={`/post/${url}`}>Read more</Button>
            </Col>
        </Card>
    );
};
