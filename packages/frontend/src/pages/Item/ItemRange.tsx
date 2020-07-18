import * as React from 'react';
import {IItem, Price} from "@truecost/shared";
import {DataContext} from 'pages/Data/Wrapper';
import {Chip, Typography, Checkbox} from '@material-ui/core';
import Markdown from 'components/Markdown';
import {useState} from 'react';
import RangeField from 'components/RangeField';
import {Row, Col} from 'pages/Base/Grid';

interface IProps {
    item: IItem
    chunk: [number, number]
    onChange: (data: [number, number]) => void
}

export const ItemRange: React.FC<IProps> = (props) => {
    const {item, chunk, onChange} = props;

    if (item.range.length === 0) {
        return null;
    }

    const data = item.range.sort((a, b) => a.at - b.at);

    return (
        <Col fullWidth>
            <RangeField
                value={chunk}
                label={"⟵ adjust ⟶"}
                labelLeft={'current'}
                labelRight={'desired'}
                min={data.first().at}
                max={data.last().at}
                marks={data.map(({at, mark}) => ({label: mark, value: at}))}
                onChangeEvent={onChange}
            />
        </Col>
    )
}