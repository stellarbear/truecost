import * as React from 'react';
import {IItem} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {Button, Typography} from '@material-ui/core';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import {Col} from 'pages/Base/Grid';
import {ModalDialog} from 'components/ModalDialog';
import {backend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';
import {Link} from 'react-router-dom';

interface IProps {
    url: string;
    item: IItem;
    options: string[];
    chunk: [number, number];
    button: JSX.Element;
}

export const AddToCartDialog: React.FC<IProps> = (props) => {
    const {button, item, options, chunk, url} = props;
    const itemId = item.id;
    const {update: {cart}} = useStore();
    const noLimit = cart.count({itemId: item.id}) < (item.limit || Infinity);
    const image = `${backend.uri}/${item.id}/${item.images[0]}/u.png`;

    return (
        <ModalDialog
            onOpen={() =>
                cart.upsert({
                    itemId,
                    optionIds: options,
                    chunk,
                    quantity: noLimit ? 1 : 0,
                })
            }
            button={button}
            content={
                [
                    <Col key="content">
                        <SafeImage
                            alt={`${item.name} image`}
                            height={300}
                            src={image} style={{objectFit: "contain", width: "inherit"}} />
                        <Typography variant="h5">
                            {`${item.name} is almost yours!`}
                        </Typography>
                        <Typography>
                            {`It's already in your cart.`}
                        </Typography>
                    </Col>,
                ]
            }
            actions={
                [
                    <Col key="actions"
                        fullWidth s={8} p={[0, 8]}>
                        <Button
                            component={Link}
                            to={`/${url}/checkout`}
                            style={{height: 60}}
                            endIcon={<ShoppingBasket />}
                            color="primary"
                            variant="contained"
                        >Proceed to checkout</Button>
                    </Col>,
                ]
            }
        />
    );
};