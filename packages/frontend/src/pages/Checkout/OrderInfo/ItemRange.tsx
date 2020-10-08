import * as React from 'react';
import {IItem} from "@truecost/shared";
import RangeField from 'components/generic/components/RangeField';
import {Col} from 'pages/Base/Grid';
import {ItemDivider} from './ItemDivider';

interface IProps {
    item: IItem;
    chunk: [number, number];
    onChange: (data: [number, number]) => void;
}

export const ItemRange: React.FC<IProps> = (props) => {
    const {item, chunk, onChange} = props;

    if (item.range.d.length === 0) {
        return null;
    }

    const data = item.range.d.sort((a, b) => a.a - b.a);

    return (
        <>
            <ItemDivider condition={item.range.d.length > 0}/>
            <Col>
                <RangeField
                    step={item.range.s}
                    single={item.range.o}
                    value={chunk}
                    label={"⟵ adjust ⟶"}
                    labelLeft={'current'}
                    labelRight={'desired'}
                    min={data.first().a}
                    max={data.last().a}
                    marks={data.map(({a, m}) => ({label: m, value: a}))}
                    onChangeEvent={onChange}
                />
            </Col>
        </>
    );
};
