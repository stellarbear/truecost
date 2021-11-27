import * as React from 'react';
import {Col, Row} from './Grid';
import {Typography} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {backend, frontend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';

interface IProps {
    text: (JSX.Element | string)[];
    actions?: React.ReactElement[];
}

export const InfoCard: React.FC<IProps> = ({text, actions = []}) => {
    const {current: {game}} = useStore();
    const image = game.id === "truecost" ? `${frontend.uri}/default/assistant.png`
        : `${backend.uri}/${game.id}/${game.assistant}/u.png`;

    return (
        <Row s={8} wrap justify="center">
            <SafeImage
                alt={"assistant icon"}
                className="float"
                height={80}
                src={image} style={{
                    minWidth: 80,
                    width: 80, height: 80, objectFit: "cover", margin: 8, marginLeft: 0,
                }} />
            <Col>
                {text.map((sentence, index) =>
                    <Typography align="center"
                        variant="body2" key={index}>{sentence}</Typography>)}
                <Row s={8} m={8} wrap justify="center">
                    {React.Children.map(actions, (action, index) =>
                        <div key={index} style={{width: "100%"}}>{action}</div>)}
                </Row>
            </Col>
        </Row>
    );
};
