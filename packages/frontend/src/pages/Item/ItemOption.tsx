import * as React from 'react';
import {useState} from 'react';
import {IItem, CalcResult, CalcPrice} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {Checkbox, Typography} from '@material-ui/core';
import {ItemDivider} from './ItemDivider';
import {TypographyTwoLevel} from 'pages/Base/TypographyTwoLevel';

interface IProps {
    item: IItem;
    price: CalcResult;
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
            {itemOptions.map((optionId) => {
                const option = CalcPrice.fromOption(price, options.local.id[optionId]);
                return (
                    <div key={`${itemId}-${optionId}`}
                        onMouseEnter={() => setHovered(optionId)}
                        onMouseLeave={() => setHovered("")}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "flex-end", cursor: "pointer",
                            backgroundColor: optionId === hovered ? "rgba(0, 0, 0, 0.15)" : "transparent",
                            transition: "all 0.3s",
                        }}
                        onClick={() => toggleOption(optionId)}>
                        <Typography variant="body1" style={{
                            textAlign: "right",
                            userSelect: "none",
                        }}>{options.local.id[optionId].name}</Typography>
                        <Checkbox checked={selected.includes(optionId)} />
                        <div style={{minWidth: 100}}>
                            <TypographyTwoLevel
                                text={option.string}
                                description={option.description}
                            />
                        </div>
                    </div>
                );
            })}
            <ItemDivider condition={itemOptions.length > 0} />
        </>
    );
};
