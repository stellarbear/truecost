import * as React from 'react';
import {Divider} from '@material-ui/core';

interface IProps {
    condition?: boolean;
}

export const ItemDivider: React.FC<IProps> = ({condition = true}) => (
    condition ? <Divider style={{margin: 8}}/> : null
);
