import * as React from 'react';
import {IItem} from "@truecost/shared";
import {DataContext} from 'pages/Data/Wrapper';
import {Chip, Typography, ButtonBase, IconButton} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import {Link} from 'react-router-dom';

interface IProps {
    item: IItem
}

export const ItemChildren: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id;

    const {current: {shop, game: {url}}} = React.useContext(DataContext);
    const {items, } = shop();

    if (item.item.length === 0) {
        return null;
    }

    return (
        <>
            {
                item.item.map((childId) => (childId in items.id) && (
                    <ButtonBase
                        component={Link} 
                        key={`${itemId}-${childId}`}
                        to={`/${url}/item/${items.id[childId].url}`}
                        style={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "flex-start" }}>
                        <IconButton size="small">
                            <LinkIcon />
                        </IconButton>
                        <Typography
                            variant="body1"
                            style={{ whiteSpace: "nowrap", cursor: "pointer" }}>{items.id[childId].name}</Typography>
                    </ButtonBase>
                ))
            }
        </>
    )
}