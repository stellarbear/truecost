import * as React from 'react'
import {Col, Row} from './Grid'
import {Typography, Card} from '@material-ui/core'
import {DataContext} from 'pages/Data/Wrapper';
import {baseUri, baseGame} from 'auxiliary/route';
import {CSSProperties} from '@material-ui/core/styles/withStyles';

interface IProps {
    text: string[]
    style?: CSSProperties;
    actions?: React.ReactElement[]
}

export const InfoCard: React.FC<IProps> = ({text, actions = [], style = {}}) => {
    const {current: {game}} = React.useContext(DataContext);
    const image = `${baseUri}/${game.id}/${game.assistant}/u.png`;

    return (
        <Col style={style}>
            <Row s={8}>
                <img className="float" style={{
                    minWidth: 80,
                    width: 80, height: 80, objectFit: "cover", margin: 8, marginLeft: 0,
                }} src={image} />
                <Col>
                    {text.map((sentence, index) => <Typography key={index}>{sentence}</Typography>)}
                    <Row s={8} m={8}>
                        {React.Children.map(actions, (action, index) =>
                            <div key={index}>{action}</div>)}
                    </Row>
                </Col>
            </Row>
        </Col>
    )
}