import * as React from 'react';
import {IItem, Time} from "@truecost/shared";
import {Typography} from '@material-ui/core';
import {ItemDivider} from './ItemDivider';
import {Row} from 'pages/Base/Grid';

interface IProps {
    item: IItem;
    chunk: [number, number];
}

export const ItemEta: React.FC<IProps> = (props) => {
    const {item, chunk} = props;

    return (
        <>
            <Row s={24} end>
                <Typography>{"Estimated time: " + Time.fromItem(item, chunk).toString}</Typography>
            </Row>
            <ItemDivider condition={true}/>
        </>
    );
};
