import * as React from 'react';
import {useState} from 'react';
import {IItem, Price} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {Checkbox, Typography} from '@material-ui/core';
import {ItemDivider} from './ItemDivider';

interface IProps {
    item: IItem;
    price: Price;
    selected: string[];
    onChange: (data: string[]) => void;
}

export const ItemOption: React.FC<IProps> = (props) => {
    const {item, selected, onChange, price} = props;
    const itemId = item.id;

    const [hovered, setHovered] = useState<string>("");

    const {current: {shop}} = useStore();
    const {options} = shop();

    const toggleOption = (id: string) => {
        const filtered = selected.filter(o => o != id);

        onChange(filtered.length === selected.length
            ? [...selected, id]
            : filtered);
    };

    const itemOptions = shop().getOptions(item.id);

    return (
        <>
            <ItemDivider condition={itemOptions.length > 0}/>
            {itemOptions.map((optionId) =>
                (
                    <div key={`${itemId}-${optionId}`}
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
                            userSelect: "none",
                        }}>{options.local.id[optionId].name}</Typography>
                        <Checkbox checked={selected.includes(optionId)}/>
                        <div style={{minWidth: 100}}>
                            <Typography variant="h6" style={{
                                whiteSpace: "nowrap", textAlign: "center", userSelect: "none",
                            }}>{price.getOption(options.local.id[optionId]).toString}</Typography>
                        </div>
                    </div>
                ))
            }
        </>
    );
};
