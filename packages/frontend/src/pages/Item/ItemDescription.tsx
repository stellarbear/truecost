import * as React from 'react';
import {IItem} from "@truecost/shared";
import LinkIcon from '@material-ui/icons/Link';
import {IconButton, Typography} from '@material-ui/core';

interface IProps {
    item: IItem
}

export const ItemDescription: React.FC<IProps> = (props) => {
    const {item} = props;

    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
            {
                item.link && <a target="_blank" href={item.link}>
                    <IconButton>
                        <LinkIcon/>
                    </IconButton>
                </a>
            }
            <Typography variant="h4" style={{textAlign: "center"}}>{item.name}</Typography>
        </div>
    )
}
