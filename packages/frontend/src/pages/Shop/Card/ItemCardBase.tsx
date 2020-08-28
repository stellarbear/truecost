import * as React from 'react';
import {Link} from 'react-router-dom';
import {IItem, Price} from '@truecost/shared';
import {useStore} from 'pages/Data/Wrapper';
import {Button, Checkbox, Divider, Typography} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import {Row} from 'pages/Base/Grid';
import {useNotification} from 'components/wrappers/NotifyWrapper';

interface IProps {
    item: IItem;
    price: Price;
    redirect: string;
}

export const ItemCardBase: React.FC<IProps> = (props) => {
    const {item, redirect, price} = props;
    const itemId = item.id;

    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
    const [hovered, setHovered] = React.useState("");

    const {current: {shop}, update: {cart}} = useStore();
    const {notify} = useNotification();
    const {options} = shop();


    const toggleSelected = (id: string) => {
        const filtered = selectedOptions.filter(o => o != id);

        setSelectedOptions(filtered.length === selectedOptions.length
            ? [...selectedOptions, id]
            : filtered);
    };

    const totalPrice = price.withOption(selectedOptions.map(id => options.local.id[id]));
    const itemOptions = shop().getOptions(item.id);

    const noLimit = cart.count({itemId: item.id}) < (item.limit || Infinity);
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
                        <Row fullWidth between
                             s={8}
                             p={[8, 0]}
                             onMouseEnter={() => setHovered(optionId)}
                             onMouseLeave={() => setHovered("")}
                             onClick={() => toggleSelected(optionId)}
                             style={{
                                 backgroundColor: optionId === hovered ? "rgba(0, 0, 0, 0.15)" : "transparent",
                                 transition: "all 0.3s",
                             }}
                        >
                            <Checkbox
                                checked={selectedOptions.includes(optionId)}
                            />
                            <Typography variant="body2"
                                        style={{userSelect: "none"}}>{options.local.id[optionId].name}
                            </Typography>
                            <Typography variant="h6" align="center" noWrap>
                                {price.getOption(options.local.id[optionId]).toString}
                            </Typography>
                        </Row>
                        <Divider style={{paddingLeft: 8}}/>
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
                        quantity: 1,
                    });

                    notify(`${item.name} was added to your cart!`);
                } : undefined}
            >
                <Row between fullWidth>
                    <Typography variant="caption">{noLimit ? "add to cart" : "item in your cart"}</Typography>
                    {
                        noLimit
                            ? <Typography variant="h5">{totalPrice.toString}</Typography>
                            : <CheckCircle style={{marginTop: 8}}/>
                    }

                </Row>
            </Button>
        </div>
    );
};
