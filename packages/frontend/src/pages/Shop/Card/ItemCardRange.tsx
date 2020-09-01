import * as React from 'react';
import {Link} from 'react-router-dom';
import {IItem, CalcResult} from '@truecost/shared';
import {useStore} from 'pages/Data/Wrapper';
import {Button, ButtonBase, Typography} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';

interface IProps {
    item: IItem;
    price: CalcResult;
    redirect: string;
}

export const ItemCardRange: React.FC<IProps> = (props) => {
    const {item, redirect, price} = props;

    const {update: {cart}} = useStore();
    const noLimit = cart.count({itemId: item.id}) < (item.limit || Infinity);

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
                        color={noLimit ? "primary" : "default"}
                        variant="contained"
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                        }}>
                            <Typography variant="caption">{noLimit ? "starting from" : "item in your cart"}</Typography>
                            {
                                noLimit
                                    ? <Typography variant="h5">{price.string}</Typography>
                                    : <CheckCircle/>
                            }
                        </div>
                    </Button>
                </div>
            </div>
        </ButtonBase>
    );
};
