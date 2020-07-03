import React, {useContext, useState} from 'react';
import {CartContext, OptionArea} from 'pages/Base/CartWrapper';
import {imageUri} from 'auxiliary/route';
import {
    Button,
    Checkbox,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Hidden,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@material-ui/core';
import PriceTypo from 'pages/Base/PriceTypo';
import RangeField from 'components/RangeField';
import {Delete} from 'mdi-material-ui';
import {Add, Remove} from '@material-ui/icons';
import DefaultImage from 'components/DefaultImage';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Link} from "react-router-dom";
import LinkIcon from '@material-ui/icons/Link';

interface OrderInfoProps {
}

const OrderInfo: React.FC<OrderInfoProps> = ({}) => {
    const {
        cart: {data, addItem, removeItem, toggleItemOption, toggleGlobalOption},
        store: {itemUrlIdMap, itemList, optionList, passList},
        math: {calculateFor, calculateTotal, stringifyPrice, getItemPrice, validateDiscount, applyDiscount, collectDiscounts},
    } = useContext(CartContext);

    const [hovered, setHovered] = useState("");
    const globalOptionKeys = Object.keys(optionList).filter(key => optionList[key].area === OptionArea.global);

    const renderItem = () => {
        const buildItem = (id: string) => {
            const item = data.items[id];
            const [image, price, name] = [imageUri("item", id, "img-96w"), itemList[id].price, itemList[id].name];
            const basePrice = itemList[id].range.length > 0 ? getItemPrice(id, item.range) : price;

            return (
                <div key={`cart-item-${id}`}
                     style={{display: "flex", alignItems: "center", width: "100%", padding: "8px 0px"}}>
                    <div style={{width: "100%"}}>
                        <ExpansionPanel style={{width: "100%"}}>
                            <ExpansionPanelSummary
                                style={{padding: "0px 16px 0px 8px"}}
                                expandIcon={<ExpandMoreIcon/>}
                            >
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}>
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <IconButton style={{width: 48, height: 48, marginRight: 8}}
                                                    onClick={() => removeItem(id)}>
                                            <Delete/>
                                        </IconButton>
                                        <Typography
                                            style={{whiteSpace: "pre-wrap"}}>{name.replace(/\(/g, "\n(")}</Typography>
                                    </div>
                                    <div style={{
                                        whiteSpace: "nowrap",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                    }}>
                                        <PriceTypo
                                            price={calculateFor(id)}
                                            priceWithDiscount={calculateFor(id)}/>
                                        <Typography variant="caption">{`${basePrice} x ${item.quantity}`}</Typography>
                                    </div>
                                </div>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{paddingBottom: 16}}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    alignItems: "flex-end",
                                }}>
                                    <Divider style={{width: "100%"}}/>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                        justifyContent: "space-between",
                                    }}>
                                        <IconButton component={Link} to={`/item/${itemList[id].url}`}
                                                    style={{marginLeft: -10}}>
                                            <LinkIcon/>
                                        </IconButton>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignSelf: "flex-end",
                                            padding: 8,
                                        }}>
                                            <IconButton style={{width: 48, height: 48}}
                                                        disabled={item.quantity <= 1}
                                                        onClick={(event) => {
                                                            removeItem(id, 1);
                                                            event.stopPropagation();
                                                        }}>
                                                <Remove/>
                                            </IconButton>
                                            <Typography style={{display: "flex", alignItems: "center"}}
                                                        variant="h6">{item.quantity}</Typography>

                                            <IconButton style={{width: 48, height: 48}}
                                                        disabled={item.quantity >= itemList[id].limit}
                                                        onClick={(event) => {
                                                            addItem(id, item.range, 1, item.options);
                                                            event.stopPropagation();
                                                        }}>
                                                <Add/>
                                            </IconButton>
                                        </div>
                                    </div>
                                    {itemList[id].range.length > 0 && (
                                        <div style={{width: "100%"}}>
                                            <Divider style={{width: "100%", marginBottom: 16}}/>
                                            <RangeField
                                                showMarks
                                                value={item.range}
                                                label={"⟵ adjust ⟶"}
                                                labelLeft={'current'}
                                                labelRight={'desired'}
                                                min={itemList[id].range[0].from}
                                                max={itemList[id].range[itemList[id].range.length - 1].to}
                                                marks={itemList[id].mark}
                                                single={true}
                                                onChangeEvent={(value) => addItem(id, value, 0, item.options)}
                                            />
                                        </div>
                                    )}
                                    <Divider style={{width: "100%"}}/>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        width: "100%",
                                        justifyContent: "space-between",
                                    }}>
                                        <Hidden xsDown>
                                            <DefaultImage
                                                src={imageUri("item", id, "img-96w")}
                                                srcSet={`${imageUri("item", id, "img-96w")} 96w`}
                                                height={96}
                                                style={{objectFit: "contain", marginTop: 8}}/>
                                        </Hidden>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                            width: "100%",
                                            justifyContent: "space-between",
                                        }}>
                                            {itemList[id].option.map((o) =>
                                                <div key={`${id}-option-${o}`}
                                                     style={{
                                                         display: "flex", alignItems: "center",
                                                         backgroundColor: id + o === hovered ? "rgba(0, 0, 0, 0.15)" : "transparent",
                                                         transition: "all 0.3s", cursor: "pointer",
                                                     }}
                                                     onClick={() => toggleItemOption(id, o)}
                                                     onMouseEnter={() => setHovered(id + o)}
                                                     onMouseLeave={() => setHovered("")}>
                                                    <Typography variant="caption" style={{
                                                        textAlign: 'right', userSelect: "none",
                                                    }}>{optionList[o].name}</Typography>
                                                    <Checkbox size="small"
                                                              checked={item.options.includes(o)}/>
                                                    <div style={{minWidth: 40}}>
                                                        <Typography variant="caption" style={{
                                                            whiteSpace: "nowrap", userSelect: "none",
                                                            minWidth: 160,
                                                        }}>{stringifyPrice(o, id)}</Typography>
                                                    </div>
                                                </div>,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
                </div>
            );
        };

        const items = Object.keys(data.items);
        if (items.length === 0) {
            return (
                <div style={{
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <React.Fragment>
                        <Typography style={{textAlign: "center", marginTop: 20}}>Ooups! It seems that you have forgotten
                            to fill you basket</Typography>
                        <Button style={{margin: 8}} variant="outlined" component={Link} to="/shop">Go some
                            shopping!</Button>
                        <Typography style={{textAlign: "center", marginTop: 20}}>But If you are here just to purchuase a
                            discount, safely navigate go to step № 3!</Typography>
                    </React.Fragment>
                </div>
            );
        }

        return items.map(key => buildItem(key));
    };

    const renderGlobalOptions = () => {
        const buildGlobalOption = (id: string) => {
            return (
                <TableRow key={`option-${id}`} onClick={() => toggleGlobalOption(id)}
                          onMouseEnter={() => setHovered(id)}
                          onMouseLeave={() => setHovered("")}
                          style={{
                              backgroundColor: id === hovered ? "rgba(0, 0, 0, 0.15)" : "transparent",
                              transition: "all 0.3s", cursor: "pointer",
                          }}
                >
                    <TableCell align="right">
                        <Typography variant="caption">{optionList[id].name}</Typography>
                    </TableCell>
                    <TableCell align="right" style={{padding: 4}}>
                        <Checkbox
                            checked={data.options.includes(id)}
                        />
                    </TableCell>
                    <TableCell align="left">
                        <Typography variant="h5" style={{whiteSpace: "nowrap"}}>
                            {stringifyPrice(id)}
                        </Typography>
                    </TableCell>
                </TableRow>
            );
        };

        const items = Object.keys(data.items);
        return (items.length > 0 && (
            <Table size="medium" style={{width: "min-content", margin: "0 0 0 auto"}}>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={3} align="right" style={{padding: 8}}/>
                    </TableRow>
                    {globalOptionKeys.map(key => buildGlobalOption(key))}
                </TableBody>
            </Table>
        ));
    };

    const renderPrice = () => (
        <div style={{
            width: "min-content",
            margin: "16px 0px 12px auto",
        }}>
            <Typography style={{textAlign: "right", opacity: 0.4, whiteSpace: "nowrap"}}>total price</Typography>
            <Divider style={{margin: "4px 0px 8px 0px"}}/>
            <Typography variant="h5"
                        style={{textAlign: "center", whiteSpace: "nowrap"}}>{`${calculateTotal()} $`}</Typography>
        </div>
    );

    return (
        <React.Fragment>
            <Typography style={{textAlign: "right", marginTop: 16, marginBottom: -4, opacity: 0.4}}>order
                details</Typography>
            {renderItem()}
            <Typography style={{textAlign: "right", marginTop: 16, marginBottom: -12, opacity: 0.4}}>order
                options</Typography>
            {renderGlobalOptions()}
        </React.Fragment>
    );
};

export default OrderInfo;
