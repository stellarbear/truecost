import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Accordion, AccordionDetails, AccordionSummary, Typography} from '@material-ui/core';
import {CalcPrice, CalcResult} from '@truecost/shared';
import {Col, Row} from 'pages/Base/Grid';
import {ExpandMore} from '@material-ui/icons';
import {PriceTypography} from 'pages/Base/PriceTypography';
import {OptionRow} from 'pages/Base/OptionRow';

interface IProps {
    total: CalcResult;
}

export const ItemExtra: React.FC<IProps> = (props) => {
    const {total} = props;

    const {current: {shop, cart}, update, currency} = useStore();
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
            .map(id => CalcPrice.fromOption(total, currency, options[id]).value)
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
                        <PriceTypography price={totalOptionsPrice} />
                    </Row>
                </AccordionSummary>
                <AccordionDetails>
                    <Col fullWidth>
                        {Object.keys(options).map((optionId) => {
                            console.log(total);
                            const option = CalcPrice.fromOption(total, currency, options[optionId]);
                            const value = `${option.value >= 0 ? '+' : '-'} ${currency.label}${Math.abs(option.value)}`;
                            return (
                                <OptionRow
                                    key={optionId}
                                    name={options[optionId].name}
                                    toggleOption={toggleOption}
                                    selected={selected}
                                    optionId={optionId}
                                    value={value}
                                />
                            );
                        })}
                    </Col>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};
