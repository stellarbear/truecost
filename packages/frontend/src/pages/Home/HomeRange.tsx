import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Paper} from '@material-ui/core';
import {dictSort} from '@truecost/shared';
import {HomeItemLanding} from './HomeItemLanding';


interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

export const HomeRange: React.FC = () => {
    const {current: {shop}} = useStore();

    const {items: {id: items}} = shop();

    const id = dictSort(items).filter(id => items[id].range.d.length > 0)[0];

    if (!id) {
        return null;
    }

    return (
        <Paper elevation={6}>
            <HomeItemLanding item={items[id]} />
        </Paper>
    );
};
