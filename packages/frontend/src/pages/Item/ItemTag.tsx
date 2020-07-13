import * as React from 'react';
import {IItem} from "@truecost/shared";
import {DataContext} from 'pages/Data/Wrapper';
import {Chip} from '@material-ui/core';

interface IProps {
    item: IItem
}

export const ItemTag: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id
    const {current: {shop}} = React.useContext(DataContext);
    const {tags, } = shop();

    return (
        <>
            {
                item.tag.map(({id: tagId}) => (tagId in tags.id) && (
                    <div key={`${itemId}-${tagId}`} style={{padding: 4}}>
                        <Chip label={tags.id[tagId].name} color="primary" size="small" />
                    </div>
                ))
            }           
        </>
    )
}