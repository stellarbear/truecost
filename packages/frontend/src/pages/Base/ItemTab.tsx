import React, {useContext, useState} from "react";
import {AppBar, Box, createStyles, makeStyles, Tab, Tabs, Theme, Typography} from "@material-ui/core";
import {CartContext} from "./CartWrapper";
import DefaultImage from "components/DefaultImage";
import {imageUri} from "auxiliary/route";
import ItemBase from "./ItemBase";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            justifyContent: "center",
        },
        scroller: {
            flexGrow: 0,
        },
    }),
);

interface ItemTabProps {
    items: string[];
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...rest} = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            {...rest}
        >
            {value === index && <Box p={1}>{children}</Box>}
        </Typography>
    );
}

const ItemTab: React.FC<ItemTabProps> = ({
                                             items,
                                         }) => {
    if (items.length === 0) {
        return null;
    }
    const {
        store: {itemList},
    } = useContext(CartContext);

    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <AppBar position="static" color="default" style={{borderRadius: "6px 6px 0px 0px"}}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
                    classes={{root: classes.root, scroller: classes.scroller}}
                >
                    {
                        items.map(id => (
                            <Tab key={`tab-${id}`} label={itemList[id].name} icon={
                                <DefaultImage src={imageUri("item", id, "img-48w")}
                                              style={{objectFit: "contain", height: 48, width: 48}}/>
                            }/>
                        ))
                    }
                </Tabs>
            </AppBar>
            {
                items.map((id, index) => (
                    <TabPanel key={`panel-${id}`} value={value} index={index}>
                        <ItemBase id={id}/>
                    </TabPanel>
                ))
            }
        </React.Fragment>
    );
};

export default ItemTab;
