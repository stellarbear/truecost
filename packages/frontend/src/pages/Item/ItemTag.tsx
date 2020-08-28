import * as React from 'react';
import {IItem} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {Chip} from '@material-ui/core';
import {ItemDivider} from './ItemDivider';
import {Row} from 'pages/Base/Grid';

interface IProps {
    item: IItem;
    chunk: [number, number];
}

export const ItemTag: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id;
    const {current: {shop}} = useStore();
    const {tags} = shop();

    return (
        <>
            <Row start s={4}>
                {
                    item.tag.map((tagId) => (tagId in tags.id) && (
                        <Chip
                            key={`${itemId}-${tagId}`}
                            label={tags.id[tagId].name} color="primary" size="small"/>
                    ))
                }
            </Row>
            <ItemDivider condition={true}/>
        </>
    );
};
