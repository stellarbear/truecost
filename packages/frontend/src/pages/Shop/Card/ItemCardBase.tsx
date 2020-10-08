import * as React from 'react';
import {Link} from 'react-router-dom';
import {IItem, CalcResult, CalcPrice} from '@truecost/shared';
import {useStore} from 'pages/Data/Wrapper';
import {Button, Checkbox, Divider, NoSsr, Typography} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import {Row} from 'pages/Base/Grid';
import {useNotification} from 'components/wrappers/NotifyWrapper';
import {TypographyTwoLevel} from 'pages/Base/TypographyTwoLevel';

interface IProps {
    item: IItem;
    price: CalcResult;
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

    const totalPrice = CalcPrice.fromItemAndOptions(price, selectedOptions.map(id => options.local.id[id]));
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
                <NoSsr>
                    {itemOptions.length > 0 ? itemOptions.map((optionId) => {
                        const option = CalcPrice.fromOption(price, options.local.id[optionId]);
                        const name = options.local.id[optionId].name;

                        return (
                            <div key={`${itemId}-option-${optionId}`}>
                                <Row
                                    justify="space-between"
                                    align="center"
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
                                        inputProps={{'aria-label': name}}
                                        checked={selectedOptions.includes(optionId)}
                                    />
                                    <Typography variant="body2"
                                        style={{userSelect: "none"}}>{name}
                                    </Typography>
                                    <TypographyTwoLevel
                                        style={{minWidth: 80}}
                                        text={option.string}
                                        description={option.description}
                                    />
                                </Row>
                                <Divider style={{paddingLeft: 8}} />
                            </div>
                        );
                    }) : (
                            <Typography style={{margin: 32, textAlign: "center"}}>
                                No options available.
                            </Typography>
                        )}
                </NoSsr>
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
                <Row justify="space-between"
                    fullWidth align="center">
                    <Typography variant="caption">{noLimit ? "add to cart" : "item in your cart"}</Typography>
                    {
                        noLimit
                            ? <Typography variant="h5">{totalPrice.string}</Typography>
                            : <CheckCircle style={{marginTop: 8}} />
                    }

                </Row>
            </Button>
        </div>
    );
};
