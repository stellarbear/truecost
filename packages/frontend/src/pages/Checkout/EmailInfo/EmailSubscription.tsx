import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {dictSort} from '@truecost/shared';
import {useState} from 'react';
import {Typography, Checkbox, Divider} from '@material-ui/core';
import {Col, Row} from 'pages/Base/Grid';

interface IProps {
    current?: string
    selected?: string
    setSelected: (value?: string) => void
}


export const EmailSubscription: React.FC<IProps> = ({selected, setSelected, current}) => {
    const {subs} = useStore();
    const [hovered, setHovered] = useState<string>("")

    const subsSorted = dictSort(subs);
    const payed = !!current;

    const mock = () => (
        <Typography variant="caption">Unfortunaltely, no plans available</Typography>
    )

    return (
        <Col s={8} fullWidth>
            <Typography variant="caption">Select subscription (optional)</Typography>
            <Divider />
            <Col fullWidth style={{
                opacity: payed ? 0.4 : 1.0,
            }}>
                {subsSorted.length > 0 ?
                    subsSorted.map(subId => (
                        <div key={`${subId}`}
                            onMouseEnter={() => setHovered(subId)}
                            onMouseLeave={() => setHovered("")}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "flex-end", cursor: "pointer",
                                backgroundColor: subId === hovered ? "rgba(0, 0, 0, 0.15)" : "transparent",
                                transition: "all 0.3s",
                            }}
                            onClick={() => !payed && setSelected(selected === subId ? undefined : subId)}>
                            <Row fullWidth between p={8}>
                                <Typography style={{
                                    textAlign: "right",
                                    userSelect: "none"
                                }}>{subs[subId].name}</Typography>
                                <Typography variant="caption" style={{
                                    textAlign: "right",
                                    userSelect: "none"
                                }}>{subs[subId].description}</Typography>
                            </Row>
                            <Checkbox checked={current === subId || selected === subId} disabled={payed} />
                            <div style={{minWidth: 100}}>
                                <Typography variant="h6" style={{
                                    whiteSpace: "nowrap", textAlign: "center", userSelect: "none"
                                }}>{`${subs[subId].price} $`}</Typography>
                            </div>
                        </div>
                    )) : mock()}
            </Col>
            {subsSorted.length > 0 && <Divider />}
        </Col>
    );
}