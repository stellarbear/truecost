import * as React from 'react';
import {IItem} from "@truecost/shared";
import LinkIcon from '@material-ui/icons/Link';
import {IconButton, Typography, Divider} from '@material-ui/core';
import {render} from 'react-dom';

interface IProps {
    item?: IItem
    prop?: keyof IItem
}

export const ItemDivider: React.FC<IProps> = (props) => {
    const {item, prop} = props;
    const render = <Divider style={{ margin: 8 }} />;

    if (!item || !prop) {
        return render;
    }

    const value = item[prop];

    if ((Array.isArray(value) || (typeof value == "string")) && value.length > 0) {
        return render;
    }

    return null;
}