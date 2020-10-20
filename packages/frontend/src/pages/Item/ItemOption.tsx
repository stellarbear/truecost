import * as React from 'react';
import {useState} from 'react';
import {CalcPrice, CalcResult, IItem} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {Typography, Switch} from '@material-ui/core';
import {ItemDivider} from './ItemDivider';
import {Row} from 'pages/Base/Grid';

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
            <Typography variant="body1">Options:</Typography>
            {itemOptions.map((optionId) => {
                const option = CalcPrice.fromOption(price, options.local.id[optionId]);
                const value = `${option.value >= 0 ? '+' : '-'} $${Math.abs(option.value)}`;
                return (
                    <Row p={2}
                        align="center"
                        justify="space-between"
                        key={`${itemId}-${optionId}`}
                        onMouseEnter={() => setHovered(optionId)}
                        onMouseLeave={() => setHovered("")}
                        onClick={() => toggleOption(optionId)}

                        style={{
                            backgroundColor: optionId === hovered ? "rgba(0, 0, 0, 0.05)" : "transparent",
                            transition: "all 0.3s", cursor: "pointer",
                        }}
                    >
                        <Row align="center">
                            <Switch
                                checked={selected.includes(optionId)}
                            />
                            <Typography variant="body1" style={{
                                textAlign: "right",
                                userSelect: "none",
                            }}>{options.local.id[optionId].name}</Typography>
                        </Row>
                        <Typography style={{paddingRight: 16}}>
                            <strong>
                                {value}
                            </strong>
                        </Typography>
                    </Row>
                );
            })}
            <ItemDivider condition={itemOptions.length > 0} />
        </>
    );
};
