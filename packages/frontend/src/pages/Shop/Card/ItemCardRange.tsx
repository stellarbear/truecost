import * as React from 'react';
import {Link} from 'react-router-dom';
import {IItem, Price} from '@truecost/shared';
import {DataContext} from 'pages/Data/Wrapper';
import {Button, Typography, Checkbox, Divider, ButtonBase} from '@material-ui/core';
import {NotificationContext} from 'components/wrappers';

interface IProps {
    item: IItem
    price: Price
    redirect: string
}

export const ItemCardRange: React.FC<IProps> = (props) => {
    const {item, redirect, price} = props;
    const itemId = item.id;

    return (
        <ButtonBase component={Link} to={redirect} style={{height: "100%"}}>
            < div style={{display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between"}}>
                <Button
                    style={{padding: 20}}
                >
                    Open item page
                </Button>
                <div style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    flexDirection: "column",
                }}>
                    <Typography style={{margin: 32, textAlign: "center"}}>This price is variable. Go to item page in
                        order to configure it.</Typography>
                </div>
                <div style={{display: 'flex', justifyContent: "center"}}>
                    <Button
                        style={{
                            width: "100%",
                            whiteSpace: "nowrap",
                            height: 60,
                        }}
                        size="large"
                        color="primary"
                        variant="contained"
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                        }}>
                            <Typography variant="caption">starting from </Typography>
                            <Typography variant="h5">{price.toString}</Typography>
                        </div>
                    </Button>
                </div>
            </div>
        </ButtonBase>
    );
}