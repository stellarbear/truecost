import * as React from 'react';
import {Link} from 'react-router-dom';
import {IItem, Price} from '@truecost/shared';
import {DataContext} from 'pages/Data/Wrapper';
import {Button, Typography, Checkbox, Divider} from '@material-ui/core';
import {NotificationContext} from 'components/wrappers';
import {Col, Row} from 'pages/Base/Grid';

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

    const {current: {shop, game: {url}}} = React.useContext(DataContext);
    const {notify} = React.useContext(NotificationContext);
    const {options, cart} = shop();


    const toggleSelected = (id: string) => {
        const filtered = selectedOptions.filter(o => o != id);

        setSelectedOptions(filtered.length === selectedOptions.length
            ? [...selectedOptions, id]
            : filtered);
    }

    const totalPrice = price.withOption(selectedOptions.map(id => options.local[id]));

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
                {item.option.length > 0 ? item.option.map(({id: optionId}) => (optionId in options.local) &&
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
                                    style={{userSelect: "none"}}>{options.local[optionId].name}</Typography>
                            </div>
                            <Typography variant="h6"
                                style={{
                                    userSelect: "none",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                }}>{price.getOption(options.local[optionId]).toString}</Typography>
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
                color="primary"
                variant="contained"
                style={{
                    height: 60,
                }}
                onClick={() => {
                    cart.add({id: itemId, options: selectedOptions});
                    notify(`${name} was added to your cart!`);
                }}
            >
                <Row between>
                    <Typography variant="caption">add to cart</Typography>
                    <Typography variant="h5">{totalPrice.toString}</Typography>
                </Row>
            </Button>
        </div>
    );
}