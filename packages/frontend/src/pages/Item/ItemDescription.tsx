import * as React from 'react';
import {IItem} from "@truecost/shared";
import LinkIcon from '@material-ui/icons/Link';
import {useStore} from 'pages/Data/Wrapper';
import {IconButton, Typography} from '@material-ui/core';
import {Chip} from '@material-ui/core';
import {Row} from 'pages/Base/Grid';
import {ItemDivider} from './ItemDivider';

interface IProps {
    item: IItem;
}

export const ItemDescription: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id;
    const {current: {shop}} = useStore();
    const {tags} = shop();

    return (
        <>
            <Row justify="space-between">
                <Row align="center">
                    {
                        item.link && <a target="_blank" rel="noreferrer" href={item.link}>
                            <IconButton>
                                <LinkIcon />
                            </IconButton>
                        </a>
                    }
                    <Typography variant="h4" component="h1" style={{textAlign: "center"}}>{item.name}</Typography>
                </Row>
                <Row s={4} align="center" p={[0, 8]}>
                    {
                        item.tag.map((tagId) => (tagId in tags.id) && (
                            <Chip
                                key={`${itemId}-${tagId}`}
                                label={tags.id[tagId].name} color="primary" size="small" />
                        ))
                    }
                </Row>
            </Row>
            <ItemDivider condition={true} />
        </>
    );
};
