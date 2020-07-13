import React, { useEffect, useContext } from "react";
import { Typography, Chip, Button, Divider, Card, TextField, Hidden, createStyles, FormControl, InputLabel, Select, MenuItem, IconButton, Table, TableBody, TableRow, TableCell, FormControlLabel, Checkbox, Grid, makeStyles, Theme, Slider, ButtonBase } from "@material-ui/core";
import { ArrowBack, Info } from "@material-ui/icons";
import Carousel from "components/Carousel";
import { imageUri } from "auxiliary/route";
import { Link } from 'react-router-dom'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import LinkIcon from '@material-ui/icons/Link';
import RangeField from "components/RangeField";
import DefaultImage from "components/DefaultImage";

import { text } from "assets/text";
import { NotificationContext } from "components/wrappers";
import Markdown from "components/Markdown";

interface IItemBaseProps {
    id: string;
}

const ItemBase: React.FC<IItemBaseProps> = ({
    id
}) => {
    const { store: { itemList, tagList, optionList }, cart: { addItem }, math: { stringifyPrice, calculateAt, getItemPrice, getItemPriceWithDiscount } } = React.useContext(CartContext);
    const { notify } = useContext(NotificationContext)

    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([])
    const [selected, setSelected] = React.useState("");

    const item = itemList[id];
    const { range, mark, name } = item;
    const [chunk, setChunk] = React.useState<number[]>(range.length > 0 ? [range[0].from, range[range.length - 1].to] : []);

    const toggleOption = (id: string) => {
        setSelectedOptions(selectedOptions.includes(id) ? selectedOptions.filter(t => t !== id) : [...selectedOptions, id])
    }

    const renderImage = () => (
        <div className={classes.size} style={{ margin: "auto" }}>
            <Carousel arrows={false} >
                <DefaultImage key={`${id}-image`}
                    srcSet={`${imageUri("item", id, "img-500w")} 500w`}
                    src={imageUri("item", id)} className={classes.size} style={{ objectFit: "contain" }} />
                {item.items.map(c => c in itemList && (
                    <DefaultImage key={`${id}-image-${c}`}
                        srcSet={`${imageUri("item", c, "img-500w")} 500w`}
                        src={imageUri("item", c)} className={classes.size} style={{ objectFit: "contain" }} />
                ))}
                {item.preview.map((c, i) =>
                    <DefaultImage key={`${id}-image-${i}-preview`}
                        srcSet={`${imageUri("item", `${id}-${c}`, "img-500w")} 500w`}
                        src={imageUri("item", `${id}-${c}`)} className={classes.size} style={{ objectFit: "contain" }} />
                )}
            </Carousel>
        </div>
    )


    const renderDescription = () => {
        return (
            <div style={{
                position: "relative",
            }}>
                {item.isActive || (
                    <Typography style={{
                        position: "absolute",
                        marginTop: 80,
                        width: "100%",
                        textAlign: "center",
                    }} variant="h6">{text.item.unavailable}</Typography>
                )}
                <div style={{
                    display: "flex", justifyContent: "center", flexDirection: "column",
                    filter: item.isActive ? "none" : "blur(20px)"
                }}>
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
                        {
                            item.link && <a target="_blank" href={item.link} >
                                <IconButton>
                                    <LinkIcon />
                                </IconButton>
                            </a>
                        }
                        <Typography variant="h4" style={{ textAlign: "center" }}>{item.name}</Typography>
                    </div>
                    {item.only && (
                        <React.Fragment>
                            <Divider style={{ margin: 8 }} />
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                <div>
                                    <Typography variant="body1" style={{ textAlign: "right", opacity: 0.6 }}>Custom order for</Typography>
                                    <Typography variant="body1" style={{ textAlign: "left" }}>{item.only}</Typography>
                                </div>
                                <Info color="secondary" style={{ minWidth: 100 }} />
                            </div>
                        </React.Fragment>
                    )}


                    {range.length > 0 && (
                        <React.Fragment>
                            <Divider style={{ margin: 8, marginBottom: 16 }} />
                            <RangeField
                                showMarks
                                value={chunk}
                                label={"⟵ adjust ⟶"}
                                labelLeft={'current'}
                                labelRight={'desired'}
                                min={itemList[id].range[0].from}
                                max={itemList[id].range[itemList[id].range.length - 1].to}
                                marks={mark}
                                single={true}
                                onChangeEvent={(value) => setChunk(value)}
                            />
                        </React.Fragment>
                    )}
                    <Divider style={{ margin: 8 }} />
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "flex-end",
                    }}>
                        <Typography variant="body1" style={{ textAlign: "right", userSelect: "none", marginRight: 10 }}>{"Base price"}</Typography>
                        <div style={{ minWidth: 100 }}>
                            <PriceTypo
                                price={getItemPrice(id, chunk)}
                                priceWithDiscount={getItemPriceWithDiscount(id, chunk)} />
                        </div>
                    </div>

                    {item.option.length > 0 && (
                        <React.Fragment>
                            <Divider style={{ margin: 8 }} />
                            {item.option.map((o) => (
                                <div key={`${id}-option-${o}`}
                                    onMouseEnter={() => setSelected(o)}
                                    onMouseLeave={() => setSelected("")}
                                    style={{
                                        display: "flex", alignItems: "center", justifyContent: "flex-end", cursor: "pointer",
                                        backgroundColor: o === selected ? "rgba(0, 0, 0, 0.15)" : "transparent",
                                        transition: "all 0.3s",
                                    }}
                                    onClick={() => toggleOption(o)}>
                                    <Typography variant="body1" style={{ textAlign: "right", userSelect: "none" }}>{optionList[o].name}</Typography>
                                    <Checkbox checked={selectedOptions.includes(o)} />
                                    <div style={{ minWidth: 100 }}>
                                        <Typography variant="h6" style={{
                                            whiteSpace: "nowrap", textAlign: "center", userSelect: "none"
                                        }}>{stringifyPrice(o, getItemPrice(id, chunk))}</Typography>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    )}

                    <Divider style={{ margin: 8 }} />
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                        <Button
                            style={{
                                width: "100%",
                                whiteSpace: "nowrap",
                            }}
                            size="large"
                            color="primary"
                            variant="contained"
                            startIcon={<AddShoppingCartIcon />}
                            onClick={() => {
                                if (item.isActive) {
                                    addItem(id, chunk, 1, selectedOptions)
                                    notify(`${name} was added to your cart!`)
                                }
                            }}
                        >
                            <div style={{
                                display: "flex", justifyContent: "space-between",
                                width: "100%",
                                alignItems: "center"
                            }}>
                                <Typography variant="caption">add to cart</Typography>
                                <Typography variant="h6"> {`${calculateAt(getItemPrice(id, chunk), selectedOptions)} $`}</Typography>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>)
    }

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} md={6} style={{ maxWidth: 500, float: "right", margin: 16 }}>
                {renderImage()}
            </Grid>
            <Grid item xs={12} md={6} style={{ maxWidth: 400, margin: 16 }}>
                {renderDescription()}
            </Grid>
        </Grid>
    );
}

export default ItemBase;