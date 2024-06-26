import React from "react";
import {Button, Divider, Drawer, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";

import {ItemProp} from "./types";
import {Col, Row} from "pages/Base/Grid";
import {useShared} from "./CRUD";
import {visible} from "./Visible";

interface UserListProps {
    propsFilter: ItemProp[];
    title: string;
}

const defaultState = (props: ItemProp[]) =>
    props.reduce((acc, cur) => Object.assign(acc, {[cur.data.key]: undefined}), {});

export const Filter: React.FC<UserListProps> = (props) => {
    const {
        title,
        propsFilter,
    } = props;
    const [, setShare] = useShared();
    const [state, setState] = React.useState<any>(defaultState(propsFilter));
    const {renderVisible, propsFiltered} = visible({key: `filter-${title}`, propsArray: propsFilter});

    const [drawer, setDrawer] = React.useState(false);

    const onChange = (prop: string, value: any) => {
        const newState = {...state, [prop]: value};
        console.log('trying filter', newState);
        setState(newState);
        setShare({vars: newState});
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
                <Button variant="contained" onClick={() => setDrawer(true)} disabled={propsFilter.length === 0}>
                    <Typography>Filter records</Typography>
                </Button>
            </Row>
            <Drawer anchor={'left'} open={drawer} onClose={() => setDrawer(false)}>
                <Col s={16} p={16}
                     style={{minWidth: 400}}>
                    <Divider/>
                    <Table size="small" style={{width: 'auto'}}>
                        <TableBody>
                            {propsFiltered.map((prop, index) =>
                                <TableRow key={`${prop.data.key}-${index}`}>
                                    <TableCell align="right" style={{width: '100%'}}>{render(prop)}</TableCell>
                                    <TableCell align="left">{prop.data.label}</TableCell>
                                </TableRow>,
                            )}
                        </TableBody>
                    </Table>
                </Col>
            </Drawer>
        </React.Fragment>
    );
};
