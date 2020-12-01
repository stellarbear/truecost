import {NoSsr, Typography, Switch} from '@material-ui/core';
import {Hovered} from 'components';
import * as React from 'react';
import {Row} from './Grid';

interface IProps {
    name: string;
    value: string;
    optionId: string;
    selected: string[];
    toggleOption: (id: string) => void;
}

export const OptionRow: React.FC<IProps> = (props) => {
    const { toggleOption, optionId, selected, name, value } = props;

    return (
        <Hovered>
            <Row p={2} s={16}
                align="center"
                justify="space-between"
                onClick={() => toggleOption(optionId)}
            >
                <Row align="center">
                    <NoSsr>
                        <Switch
                            checked={selected.includes(optionId)}
                        />
                    </NoSsr>
                    <Typography variant="body1" style={{
                        textAlign: "left",
                        userSelect: "none",
                    }}>{name}</Typography>
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
        </Hovered>
    );
};