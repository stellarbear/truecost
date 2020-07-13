import React, {useEffect, useContext} from "react";
import {Typography, Chip, Button, Divider, Card, TextField, Hidden, createStyles, FormControl, InputLabel, Select, MenuItem, IconButton, Table, TableBody, TableRow, TableCell, FormControlLabel, Checkbox, Grid, makeStyles, Theme, Slider, Container} from "@material-ui/core";
import {ArrowBack, ArrowLeft, ArrowRight, ArrowForward, Info} from "@material-ui/icons";
import {useParams, Redirect} from "react-router-dom";
import {DataContext} from "pages/Data/Wrapper";
import {ItemCard} from "./ItemCard";

export const Item: React.FC = () => {
    const {url: itemUrl} = useParams();
    const {current: {shop, game: {url}}} = useContext(DataContext);
    const {items, } = shop();

    if (itemUrl === undefined || !(itemUrl in items.url)) {
        return <Redirect to="/404" />;
    }

    const itemId = items.url[itemUrl];
    const item = items.id[itemId];
    
    return <ItemCard item={item} />
}