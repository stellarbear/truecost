import * as React from 'react';
import {Link} from 'react-router-dom';
import {IItem, Price} from '@truecost/shared';
import {DataContext, useStore} from 'pages/Data/Wrapper';
import {Button, Typography, Checkbox, Divider} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import {Col, Row} from 'pages/Base/Grid';
import {useNotification} from 'components/wrappers/NotifyWrapper';

interface IProps {
    item: IItem
    price: Price
    redirect: string
}

export const ItemCardBase: React.FC<IProps> = (props) => {
    const {item, redirect, price} = props;
    const itemId = item.id;

    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
    const [hovered, setHovered] = React.useState("");

    const {current: {shop}, update: {cart}} = useStore();
    const {notify} = useNotification()
    const {options} = shop();


    const toggleSelected = (id: string) => {
        const filtered = selectedOptions.filter(o => o != id);

        setSelectedOptions(filtered.length === selectedOptions.length
            ? [...selectedOptions, id]
            : filtered);
    }

    const totalPrice = price.withOption(selectedOptions.map(id => options.local.id[id]));
    const itemOptions = shop().getOptions(item.id);

    const noLimit = cart.limit({itemId: item.id}) < item.limit;
    //
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between"}}>
            <Button
                component={Link}
                size="large"
                to={redirect}
            >
                Open item page
            </Button>
            <div style={{overflowY: "auto"}}>
                {itemOptions.length > 0 ? itemOptions.map((optionId) =>
                    <div key={`${itemId}-option-${optionId}`}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                padding: 8,
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: optionId === hovered ? "rgba(0, 0, 0, 0.15)" : "transparent",
                                transition: "all 0.3s",
                            }}
                            onMouseEnter={() => setHovered(optionId)}
                            onMouseLeave={() => setHovered("")}
                            onClick={() => toggleSelected(optionId)}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Checkbox
                                    checked={selectedOptions.includes(optionId)}
                                />
                                <Typography variant="body2"
                                    style={{userSelect: "none"}}>{options.local.id[optionId].name}</Typography>
                            </div>
                            <Typography variant="h6"
                                style={{
                                    userSelect: "none",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                }}>{price.getOption(options.local.id[optionId]).toString}</Typography>
                        </div>
                        <Divider style={{paddingLeft: 8}} />
                    </div>,
                ) : (
                        <Typography style={{margin: 32, textAlign: "center"}}>No options available.</Typography>
                    )}
            </div>
            <Button
                fullWidth
                size="large"
                color={noLimit ? "primary" : "default"}
                variant="contained"
                style={{
                    height: 60,
                }}
                onClick={noLimit ? () => {
                    cart.upsert({
                        itemId,
                        optionIds: selectedOptions,
                        quantity: 1
                    })

                    notify(`${name} was added to your cart!`);
                } : undefined}
            >
                <Row between fullWidth>
                    <Typography variant="caption">{noLimit ? "add to cart" : "item in your cart"}</Typography>
                    {
                        noLimit
                            ? <Typography variant="h5">{totalPrice.toString}</Typography>
                            : <CheckCircle />
                    }

                </Row>
            </Button>
        </div>
    );
}
