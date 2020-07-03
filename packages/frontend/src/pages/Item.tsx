import React, {useContext, useEffect} from "react";
import {Button, createStyles, makeStyles, Theme, Typography} from "@material-ui/core";
import {ArrowBack} from "@material-ui/icons";
import {CartContext} from "pages/Base/CartWrapper";
import {Link, Redirect, RouteComponentProps, withRouter} from "react-router-dom";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ItemRow from "pages/Base/ItemRow";
import {NotificationContext} from "components/wrappers";
import ItemBase from "./Base/ItemBase";
import Meta from "./Base/Meta";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        size: {
            [theme.breakpoints.up(658)]: {
                width: 500,
                height: 500,
            },
            [theme.breakpoints.down(658)]: {
                width: 300,
                height: 300,
            },
        },
        margin: {
            maxWidth: 1600,
            [theme.breakpoints.down(658)]: {
                margin: "10px 10px 0px",
            },
            [theme.breakpoints.up(658)]: {
                margin: "30px 30px 0px",
            },
            [theme.breakpoints.up(1600)]: {
                margin: "30px auto",
            },
        },
    }),
);

interface MatchParams {
    id: string;
}

type IItemProps = RouteComponentProps<MatchParams>;

const Item: React.FC<IItemProps> = ({
                                        match: {params: {id}},
                                    }) => {
    const classes = useStyles();
    const {store: {itemList, itemUrlIdMap, tagList, optionList}, cart: {addItem}, math: {stringifyPrice, calculateAt, getItemPrice, getItemPriceWithDiscount}} = React.useContext(CartContext);
    const {notify} = useContext(NotificationContext);

    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
    const [related, setRelated] = React.useState<string[]>([]);
    const [selected, setSelected] = React.useState("");

    if (!(id in itemUrlIdMap)) {
        return <Redirect to="/shop"/>;
    }

    id = itemUrlIdMap[id];
    const item = itemList[id];
    const {range, mark, name} = item;
    const [chunk, setChunk] = React.useState<number[]>(range.length > 0 ? [range[0].from, range[range.length - 1].to] : []);

    useEffect(() => {
        const all = Object.keys(itemList);
        const related: string[] = [];

        const limit = Math.min(all.length - 1, 8);
        for (let i = 0; i < Math.min(limit, 8); i++) {
            const index = Math.round(Math.random() * (limit - 1));
            const newItem = all[index];

            if (related.includes(newItem)) {
                i--;
            } else {
                related.push(newItem);
            }
        }

        setRelated(related);
    }, []);

    const toggleOption = (id: string) => {
        setSelectedOptions(selectedOptions.includes(id) ? selectedOptions.filter(t => t !== id) : [...selectedOptions, id]);
    };

    const renderAlts = () => {
        return (
            <div>
                <ItemRow id={"related-items"} items={related}/>
            </div>
        );
    };

    return (
        <React.Fragment>
            <Meta page="item" props={{name: item.name}}/>
            <div
                className={classes.margin}
                style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <div style={{maxWidth: 900 + 16 * 2, width: "100%", display: "flex"}}>
                    <Button
                        style={{
                            margin: "16px 16px 0px 16px",
                        }}
                        component={Link}
                        to="/shop"
                        startIcon={< ArrowBack/>}
                    >
                        To the shop
                    </Button>
                </div>
                <ItemBase id={id}/>
                {related.length > 0 && (
                    <React.Fragment>
                        <div style={{maxWidth: 900 + 16 * 2, width: "100%", display: "flex"}}>
                            <div style={{margin: "16px 16px 0px 16px", width: "100%", display: "flex"}}>
                                <ArrowDownwardIcon style={{marginRight: 8}}/>
                                <Typography variant="button" style={{textAlign: "left", width: "100%"}}>Related
                                    goods</Typography>
                            </div>
                        </div>
                        <div style={{maxWidth: 900 + 16 * 2 + 48 * 2, width: "100%"}}>
                            {renderAlts()}
                        </div>
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
};

export default withRouter(Item);
