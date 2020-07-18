import * as React from 'react'
import {Col, Row} from './Grid'
import {Typography} from '@material-ui/core'
import {DataContext} from 'pages/Data/Wrapper';
import {baseUri, baseGame} from 'auxiliary/route';

interface IProps {
    text: string[]
    actions?: React.ReactElement[]
}

export const InfoCard: React.FC<IProps> = ({text, actions = []}) => {
    const {current: {game}} = React.useContext(DataContext);
    const image = `${baseUri}/${game.id}/${game.assistant}/u.png`;

    return (
        <Col>
            <Row>
                <img className="float" style={{
                    minWidth: 80,
                    width: 80, height: 80, objectFit: "cover", margin: 8, marginLeft: 0,
                }} src={image} />
                <Col>
                    {text.map(sentence => <Typography>{sentence}</Typography>)}
                    <Row>
                        {actions}
                    </Row>
                </Col>
            </Row>
        </Col>
    )
}