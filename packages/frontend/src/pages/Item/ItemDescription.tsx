import * as React from 'react';
import {IItem} from "@truecost/shared";
import LinkIcon from '@material-ui/icons/Link';
import {IconButton, Typography} from '@material-ui/core';
import {Row} from 'pages/Base/Grid';

interface IProps {
    item: IItem;
}

export const ItemDescription: React.FC<IProps> = (props) => {
    const {item} = props;

    return (
        <Row align="center">
            {
                item.link && <a target="_blank" rel="noreferrer" href={item.link}>
                    <IconButton>
                        <LinkIcon/>
                    </IconButton>
                </a>
            }
            <Typography variant="h4" component="h1" style={{textAlign: "center"}}>{item.name}</Typography>
        </Row>
    );
};
