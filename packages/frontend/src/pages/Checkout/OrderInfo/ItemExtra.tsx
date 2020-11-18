import * as React from 'react';
import {useState} from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Accordion, AccordionDetails, AccordionSummary, Switch, Typography} from '@material-ui/core';
import {CalcPrice, CalcResult} from '@truecost/shared';
import {Col, Row} from 'pages/Base/Grid';
import {ExpandMore} from '@material-ui/icons';

interface IProps {
    total: CalcResult;
}

export const ItemExtra: React.FC<IProps> = (props) => {
    const {total} = props;

    const [hovered, setHovered] = useState<string>("");

    const {current: {shop, cart}, update} = useStore();
    const {options: {global: {id: options}}} = shop();
    const selected = cart().global;
    const {upsert} = update.cart;

    const toggleOption = (id: string) => {
        const filtered = selected.filter(o => o != id);

        upsert({
            optionIds: (filtered.length === selected.length
                ? [...selected, id]
                : filtered), quantity: 0,
        });
    };

    const totalOptionsPrice =
        selected
            .map(id => CalcPrice.fromOption(total, options[id]).value)
            .reduce((acc, cur) => acc + cur, 0);

    return (
        <div>
            <Accordion elevation={3} TransitionProps={{unmountOnExit: true}} style={{}}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}>
                    <Row fullWidth
                        justify="space-between" align="center">
                        <Col>
                            <Typography >Extra options</Typography>
                            <Typography variant="caption">Expand for live stream and other options</Typography>
                        </Col>
                        <Typography
                            variant="h6"
                            style={{
                                paddingRight: 8,
                                whiteSpace: "nowrap",
                            }}>
                            {`${totalOptionsPrice} $`}
                        </Typography>
                    </Row>
                </AccordionSummary>
                <AccordionDetails>
                    {Object.keys(options).map((optionId) => {
                        const option = CalcPrice.fromOption(total, options[optionId]);
                        const value = `${option.value >= 0 ? '+' : '-'} $${Math.abs(option.value)}`;
                        return (
                            <Row fullWidth
                                key={optionId}
                                p={2} s={16}
                                align="center"
                                justify="space-between"
                                onMouseEnter={() => setHovered(optionId)}
                                onMouseLeave={() => setHovered("")}
                                onClick={() => toggleOption(optionId)}

                                style={{
                                    backgroundColor: optionId === hovered ? "rgba(0, 0, 0, 0.05)" : "transparent",
                                    transition: "all 0.3s", cursor: "pointer",
                                }}
                            >
                                <Row align="center">
                                    <Switch
                                        checked={selected.includes(optionId)}
                                    />
                                    <Typography variant="body1" style={{
                                        textAlign: "left",
                                        userSelect: "none",
                                    }}>{options[optionId].name}</Typography>
                                </Row>
                                <Typography style={{
                                    paddingRight: 16,
                                    whiteSpace: "nowrap",
                                }}>
                                    <strong>
                                        {value}
                                    </strong>
                                </Typography>
                            </Row>
                        );
                    })
                    }
                </AccordionDetails>
            </Accordion>
        </div>
    );
};
