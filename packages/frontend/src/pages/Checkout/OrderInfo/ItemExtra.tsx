import * as React from 'react';
import {IItem, Price, OptionMerge} from "@truecost/shared";
import {DataContext, useStore} from 'pages/Data/Wrapper';
import {Chip, Typography, Checkbox} from '@material-ui/core';
import Markdown from 'components/Markdown';
import {useState} from 'react';

interface IProps {
    total: Price
    selected: string[]
    onChange: (data: string[]) => void
}

export const ItemExtra: React.FC<IProps> = (props) => {
    const {selected, onChange, total} = props;

    const [hovered, setHovered] = useState<string>("")

    const {current: {shop}} = useStore();
    const {options: {global: {id: options}}} = shop();

    const toggleOption = (id: string) => {
        const filtered = selected.filter(o => o != id);

        onChange(filtered.length === selected.length
            ? [...selected, id]
            : filtered);
    }

    return (
        <>
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
        </>
    )
}
