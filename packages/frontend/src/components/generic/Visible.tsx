import * as React from 'react';
import {useStorage} from 'auxiliary/useStorage';
import {Container, Draggable, DropResult} from "react-smooth-dnd";
import {ItemProp} from './types';
import {Button, Menu, MenuItem, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon, Typography, IconButton} from '@material-ui/core';
import {arrayToDict} from 'auxiliary/sort';
import DragHandle from "@material-ui/icons/DragHandle";
import FilterList from "@material-ui/icons/FilterList";
import {Row} from 'pages/Base/Grid';

interface IProps {
    key: string
    propsArray: ItemProp[];
}

export interface IHidden {
    renderVisible: () => React.ReactNode,
    propsFiltered: ItemProp[]
}

interface IStorage {
    v: boolean
    l: string
}

const validate = (json: IStorage[], dict: Record<string, ItemProp>): IStorage[] => {
    let left = new Set(Object.keys(dict));

    let filtered = json.filter(j => {
        if (j.l in dict) {
            left.delete(j.l);
            return true;
        } else {
            return false;
        }
    });

    const append: IStorage[] = [...left].map(l => ({l, v: true}));

    return [...filtered, ...append];
}

export const visible: (props: IProps) => IHidden = (props) => {
    const {key, propsArray} = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const dict: Record<string, ItemProp> = arrayToDict(propsArray, "data", "key");
    const [visible, setVisible] = useStorage<IStorage[]>(key, [], (json) => validate(json, dict));

    const onDrop = ({removedIndex, addedIndex}: DropResult) => {
        if (removedIndex === null || addedIndex === null) {
            return
        }

        setVisible(addedIndex < removedIndex ?[
            ...visible.slice(0, addedIndex), 
            visible[removedIndex], 
            ...visible.slice(addedIndex, removedIndex), 
            ...visible.slice(removedIndex + 1),
        ] : [
            ...visible.slice(0, removedIndex), 
            ...visible.slice(removedIndex + 1, addedIndex + 1),
            visible[removedIndex], 
            ...visible.slice(addedIndex + 1),
        ]);
    };

    const onClick = (label: string) => {
        const current = visible.find(v => v.l == label);

        if (!current) {
            return;
        }

        current.v = !current.v;
        setVisible([...visible])
    }

    const render = () => (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <FilterList/>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
                    {visible.map(({l, v}) => {
                        return (
                            <Draggable key={l}>
                                <MenuItem
                                    className="drag-handle"
                                    selected={v}
                                    onClick={() => onClick(l)}
                                >
                                    <Row fullWidth start s={8}>
                                        <DragHandle />
                                        <Typography>{l}</Typography>
                                    </Row>
                                </MenuItem>
                            </Draggable>
                        )
                    })}
                </Container>
            </Menu>
        </>
    )

    return (
        {
            renderVisible: render,
            propsFiltered: visible.filter(v => v.v).map(v => dict[v.l])
        }
    )
}