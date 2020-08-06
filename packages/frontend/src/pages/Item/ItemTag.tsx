import * as React from 'react';
import {IItem, Time} from "@truecost/shared";
import {DataContext, useStore} from 'pages/Data/Wrapper';
import {Chip} from '@material-ui/core';
import {ItemDivider} from './ItemDivider';

interface IProps {
    item: IItem
    chunk: [number, number]
}

export const ItemTag: React.FC<IProps> = (props) => {
    const {item, chunk} = props;
    const itemId = item.id
    const {current: {shop}} = useStore();
    const {tags, } = shop();

    return (
        <>
            <Chip label={"eta: " + Time.fromItem(item, chunk).toString} color="secondary" size="small" />
            {
                item.tag.map((tagId) => (tagId in tags.id) && (
                    <div key={`${itemId}-${tagId}`} style={{padding: 4}}>
                        <Chip label={tags.id[tagId].name} color="primary" size="small" />
                    </div>
                ))
            }
            <ItemDivider condition={true} />
        </>
    )
}
