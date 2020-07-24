import React, {useEffect} from "react";
import {
    Card,
    Divider,
    Drawer,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
    Button,
    TableRow,
    TableCell,
    Table,
    TableBody
} from "@material-ui/core";
import FilterList from "@material-ui/icons/FilterList";

import {ItemProp} from "./types";
import {Col, Row} from "pages/Base/Grid";
import {IShared, useShared} from "./CRUD";
import {normalize} from "./normalize";
import {visible} from "./Visible";

interface UserListProps {
    propsFilter: ItemProp[];
    title: string
}

const defaultState = (props: ItemProp[]) =>
    props.reduce((acc, cur) => Object.assign(acc, {[cur.data.key]: undefined}), {});

export const Filter: React.FC<UserListProps> = (props) => {
    const {
        title,
        propsFilter,
    } = props;
    const [share, setShare] = useShared();
    const [state, setState] = React.useState<any>(defaultState(propsFilter));
    const {renderVisible, propsFiltered} = visible({key: `filter-${title}`, propsArray: propsFilter});

    const [drawer, setDrawer] = React.useState(false);

    const onChange = (prop: string, value: any) => {
        console.log(prop, value)
        const newState = {...state, [prop]: value};
        console.log(newState);
        setState(newState);
        setShare({vars: newState})
    };

    const render = (prop: ItemProp) => {
        const {data: {key}} = prop;

        return prop.renderFilter({
            value: state[key],
            state,
            onChange: (value: any) => onChange(key, value),
        } as any);
    };

    return (
        <React.Fragment>
            <Row>
                {renderVisible()}
                <Button variant="contained" onClick={() => setDrawer(true)}>
                    <Typography>Filter records</Typography>
                </Button>
            </Row>
            <Drawer anchor={'left'} open={drawer} onClose={() => setDrawer(false)}>
                <Col s={16} fullWidth p={16}
                    style={{minWidth: 400}}>
                    <Divider />
                    <Table size="small" style={{width: 'auto'}}>
                        <TableBody>
                            {propsFiltered.map((prop, index) =>
                                <TableRow key={`${prop.data.key}-${index}`}>
                                    <TableCell align="right" style={{width: '100%'}}>{render(prop)}</TableCell>
                                    <TableCell align="left">{prop.data.label}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Col>
            </Drawer>
        </React.Fragment>
    );
};
