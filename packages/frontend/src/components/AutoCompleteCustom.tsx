import * as React from 'react';
import {Autocomplete, createFilterOptions} from '@material-ui/lab';
import {TextField} from '@material-ui/core';

interface IFilter {
    id: string,
    custom: boolean
}

interface IProps {
    values: string[]
    options: string[]
    onChange: (v: string[]) => void
    onCustom: (v: string) => void
    getLabel: (v: string) => string;
}

const filter = createFilterOptions<IFilter>();

export const AutoCompleteCustom: React.FC<IProps> = (props) => {
    const {onChange, onCustom, values, options, getLabel} = props;

    let optionsOverride = options
        .map(key => ({
            id: key,
            custom: false
        }));

    let valuesOverride = values.map(n => ({id: n, custom: false}));

    return (
        <Autocomplete
            multiple
            onChange={(_, value) => {
                const newItem: IFilter = (Array.isArray(value) ? value[value.length - 1] : value);

                if (newItem?.custom) {
                    onCustom(newItem.id);
                    return;
                }

                onChange(value.map((v: any) => v.id));
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (params.inputValue !== '') {
                    filtered.push({
                        custom: true,
                        id: `custom order: "${params.inputValue}"`,
                    });
                }

                return filtered;
            }}
            getOptionSelected={(v) => valuesOverride.some(o => o.id === v.id)}
            value={valuesOverride}
            options={optionsOverride}
            getOptionLabel={({id: itemId, custom}) => !custom ? getLabel(itemId) : itemId}
            renderInput={(params) => <TextField {...params} label="Search by name" variant="outlined" />}
        />
    )
}