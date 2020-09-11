import * as React from 'react';
import {useStorage} from 'auxiliary/useStorage';
import {ItemProp} from './types';
import {IconButton, Menu, MenuItem, Typography} from '@material-ui/core';
import {arrayToDict} from '@truecost/shared';
import IconUp from "@material-ui/icons/ExpandLess";
import IconDown from "@material-ui/icons/ExpandMore";
import FilterList from "@material-ui/icons/FilterList";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {Row} from 'pages/Base/Grid';

interface IProps {
    key: string;
    propsArray: ItemProp[];
}

export interface IHidden {
    renderVisible: () => React.ReactNode;
    propsFiltered: ItemProp[];
}

interface IStorage {
    v: boolean;
    l: string;
}

const validate = (json: IStorage[], dict: Record<string, ItemProp>): IStorage[] => {
    const left = new Set(Object.keys(dict));

    const filtered = json.filter(j => {
        if (j.l in dict) {
            left.delete(j.l);
            return true;
        } else {
            return false;
        }
    });

    const append: IStorage[] = [...left].map(l => ({l, v: true}));

    return [...filtered, ...append];
};

export const visible: (props: IProps) => IHidden = (props) => {
    const {key, propsArray} = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const dict: Record<string, ItemProp> = arrayToDict(propsArray, "data", "key");
    const [visible, setVisible] = useStorage<IStorage[]>(key, [], (json) => validate(json, dict));


    const onDrop = (before: number, after: number) => {
        setVisible(after < before ? [
            ...visible.slice(0, after),
            visible[before],
            ...visible.slice(after, before),
            ...visible.slice(before + 1),
        ] : [
                ...visible.slice(0, before),
                ...visible.slice(before + 1, after + 1),
                visible[before],
                ...visible.slice(after + 1),
            ]);
    };

    const onUp = (index: number) => {
        onDrop(index, index > 0 ? index - 1 : index);
    };

    const onDown = (index: number) => {
        onDrop(index, index < visible.length - 1 ? index + 1 : index);
    };

    const onClick = (label: string) => {
        const current = visible.find(v => v.l == label);

        if (!current) {
            return;
        }

        current.v = !current.v;
        setVisible([...visible]);
    };

    const render = () => (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <FilterList />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {visible.map(({l, v}, index) => {
                    return (
                        <MenuItem
                            key={l}
                            className="drag-handle"
                        >
                            <Row fullWidth start s={8} width={["auto", "100%", "auto", "auto"]}>
                                <IconButton onClick={() => onClick(l)} >
                                    {v ? <Visibility /> : <VisibilityOff style={{opacity: 0.4}} />}
                                </IconButton>
                                <Typography>{l}</Typography>
                                <IconButton onClick={() => onUp(index)} >
                                    <IconUp />
                                </IconButton>
                                <IconButton onClick={() => onDown(index)} >
                                    <IconDown />
                                </IconButton>
                            </Row>
                        </MenuItem>
                    );
                })}
            </Menu >
        </>
    );

    return (
        {
            renderVisible: render,
            propsFiltered: visible.filter(v => v.v).map(v => dict[v.l]),
        }
    );
};
