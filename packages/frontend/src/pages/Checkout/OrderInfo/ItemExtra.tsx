import * as React from 'react';
import {IItem, Price, OptionMerge} from "@truecost/shared";
import {DataContext, useStore} from 'pages/Data/Wrapper';
import {Chip, Typography, Checkbox} from '@material-ui/core';
import Markdown from 'components/Markdown';
import {useState} from 'react';
import {ItemDivider} from './ItemDivider';

interface IProps {
    total: Price
}

export const ItemExtra: React.FC<IProps> = (props) => {
    const {total} = props;

    const [hovered, setHovered] = useState<string>("")

    const {current: {shop, cart}, update} = useStore();
    const {options: {global: {id: options}}} = shop();
    const selected = cart().global;
    const {upsert} = update.cart;

    const toggleOption = (id: string) => {
        const filtered = selected.filter(o => o != id);

        upsert({
            optionIds: (filtered.length === selected.length
                ? [...selected, id]
                : filtered), quantity: 0
        });
    }

    return (
        <>
            <ItemDivider condition={true} />
            {Object.keys(options).map((optionId) =>
                (
                    <div key={`${optionId}`}
                        onMouseEnter={() => setHovered(optionId)}
                        onMouseLeave={() => setHovered("")}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "flex-end", cursor: "pointer",
                            backgroundColor: optionId === hovered ? "rgba(0, 0, 0, 0.15)" : "transparent",
                            transition: "all 0.3s",
                        }}
                        onClick={() => toggleOption(optionId)}>
                        <Typography variant="caption" style={{
                            textAlign: "right",
                            userSelect: "none"
                        }}>{options[optionId].name}</Typography>
                        <Checkbox checked={selected.includes(optionId)} />
                        <div style={{minWidth: 100}}>
                            <Typography variant="h6" style={{
                                whiteSpace: "nowrap", textAlign: "center", userSelect: "none"
                            }}>{total.getOption(options[optionId]).toString}</Typography>
                        </div>
                    </div>
                ))
            }
            <ItemDivider condition={Object.keys(options).length > 0} />
        </>
    )
}
