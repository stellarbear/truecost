import * as React from 'react';
import {useState} from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Checkbox, Typography} from '@material-ui/core';
import {ItemDivider} from './ItemDivider';
import {CalcPrice, CalcResult} from '@truecost/shared';
import {TypographyTwoLevel} from 'pages/Base/TypographyTwoLevel';

interface IProps {
    total: CalcResult;
}

export const ItemExtra: React.FC<IProps> = (props) => {
    const {total} = props;

    const [hovered, setHovered] = useState<string>("");

    const {current: {shop, cart}, update} = useStore();
    const {options: {global: {id: options}}} = shop();
    const selected = cart().global;
    const {upsert} = update.cart;

    const toggleOption = (id: string) => {
        const filtered = selected.filter(o => o != id);

        upsert({
            optionIds: (filtered.length === selected.length
                ? [...selected, id]
                : filtered), quantity: 0,
        });
    };

    return (
        <>
            <Typography variant="caption">Extra options</Typography>
            <ItemDivider condition={true}/>
            {Object.keys(options).map((optionId) => {
                const option = CalcPrice.fromOption(total, options[optionId]);
                return (
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
                            userSelect: "none",
                        }}>{options[optionId].name}</Typography>
                        <Checkbox checked={selected.includes(optionId)}/>
                        <div style={{minWidth: 100}}>
                            <TypographyTwoLevel
                                text={option.string}
                                description={option.description}
                            />
                        </div>
                    </div>
                );
            })
            }
            <ItemDivider condition={Object.keys(options).length > 0}/>
        </>
    );
};
