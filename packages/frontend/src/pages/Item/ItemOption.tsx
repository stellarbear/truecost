import * as React from 'react';
import {IItem, Price} from "@truecost/shared";
import {DataContext} from 'pages/Data/Wrapper';
import {Chip, Typography, Checkbox} from '@material-ui/core';
import Markdown from 'components/Markdown';
import {useState} from 'react';

interface IProps {
    item: IItem
    price: Price
    selected: string[]
    onChange: (data: string[]) => void
}

export const ItemOption: React.FC<IProps> = (props) => {
    const {item, selected, onChange, price} = props;
    const itemId = item.id;

    const [hovered, setHovered] = useState<string>("")

    const {current: {shop, game: {url}}} = React.useContext(DataContext);
    const {options, } = shop();

    if (item.option.length === 0) {
        return null;
    }

    const toggleOption = (id: string) => {
        const filtered = selected.filter(o => o != id);

        onChange(filtered.length === selected.length
            ? [...selected, id]
            : filtered);
    }

    return (
        <>
            {
                item.option.map((optionId) => (optionId in options.local) && (
                    <div key={`${itemId}-${optionId}`}
                        onMouseEnter={() => setHovered(optionId)}
                        onMouseLeave={() => setHovered("")}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "flex-end", cursor: "pointer",
                            backgroundColor: optionId === hovered ? "rgba(0, 0, 0, 0.15)" : "transparent",
                            transition: "all 0.3s",
                        }}
                        onClick={() => toggleOption(optionId)}>
                        <Typography variant="body1" style={{textAlign: "right", userSelect: "none"}}>{options.local[optionId].name}</Typography>
                        <Checkbox checked={selected.includes(optionId)} />
                        <div style={{minWidth: 100}}>
                            <Typography variant="h6" style={{
                                whiteSpace: "nowrap", textAlign: "center", userSelect: "none"
                            }}>{price.getOption(options.local[optionId]).toString}</Typography>
                        </div>
                    </div>
                ))
            }
        </>
    )
}