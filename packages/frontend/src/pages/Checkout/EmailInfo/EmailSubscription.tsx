import * as React from 'react';
import {useState} from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Card, Typography} from '@material-ui/core';
import {Col, Row} from 'pages/Base/Grid';
import {colors} from 'theme';
import {CalcPrice} from '@truecost/shared';

interface IProps {
    current?: string;
    selected?: string;
    setSelected: (value?: string) => void;
}

export const EmailSubscription: React.FC<IProps> = ({selected, setSelected, current}) => {
    const {subs, currency} = useStore();
    const [hovered, setHovered] = useState<string>("");

    const ids = Object.keys(subs);
    const payed = !!current;

    const mock = () => (
        <Typography variant="caption">Unfortunaltely, no plans available</Typography>
    );

    return (
        <Col s={8}>
            <Typography variant="caption">Membership (optional, one time payment)</Typography>
            <Row s={16} style={{
                opacity: payed ? 0.4 : 1.0,
            }}>
                {ids.length > 0 ?
                    ids.map(subId => {
                        const adjustedSubscriptionPrice =
                            CalcPrice.applyCurrency(subs[subId].price, currency);

                        return (
                            <Card
                                key={`${subId}`}
                                raised={hovered === subId}
                                style={{
                                    width: 300, cursor: "pointer",
                                    ...((current === subId || selected === subId)
                                        ? {
                                            color: "#fff",
                                            backgroundColor: colors.primaryColor,
                                        } : {}),
                                }}
                                onMouseEnter={() => setHovered(subId)}
                                onMouseLeave={() => setHovered("")}
                                onClick={() => !payed && setSelected(selected === subId ? undefined : subId)}>
                                <Col p={[8, 16]}>
                                    <Row justify="space-between">
                                        <Typography style={{
                                            textAlign: "right",
                                            userSelect: "none",
                                        }}>{subs[subId].name}</Typography>
                                        <div style={{minWidth: 60}}>
                                            <Typography variant="h6" style={{
                                                whiteSpace: "nowrap", textAlign: "center", userSelect: "none",
                                            }}>{`${adjustedSubscriptionPrice} ${currency.label}`}</Typography>
                                        </div>
                                    </Row>
                                    <Typography variant="caption" component="p" style={{
                                        textAlign: "center",
                                        userSelect: "none",
                                    }}>{subs[subId].description}</Typography>
                                </Col>
                            </Card>
                        );
                    }) : mock()}
            </Row>
        </Col>
    );
};
