import * as React from 'react';
import {CalcPrice, CalcResult, IItem} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {ItemDivider} from './ItemDivider';
import {OptionRow} from 'pages/Base/OptionRow';

interface IProps {
    item: IItem;
    price: CalcResult;
    selected: string[];
    onChange: (data: string[]) => void;
}

export const ItemOption: React.FC<IProps> = (props) => {
    const {item, selected, onChange, price} = props;
    const itemId = item.id;

    const {current: {shop}, currency} = useStore();
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
            <ItemDivider condition={itemOptions.length > 0} />
            {itemOptions.map((optionId) => {
                const option = CalcPrice.fromOption(price, currency, options.local.id[optionId]);
                const value = `${option.value >= 0 ? '+' : '-'} ${currency.label}${Math.abs(option.value)}`;

                return (
                    <OptionRow
                        key={`${itemId}-${optionId}`}
                        name={options.local.id[optionId].name}
                        toggleOption={toggleOption}
                        selected={selected}
                        optionId={optionId}
                        value={value}
                    />
                );
            })
            }
        </>
    );
};
