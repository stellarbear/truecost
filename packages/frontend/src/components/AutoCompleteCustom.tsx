import * as React from 'react';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {Button, TextField, Typography} from '@material-ui/core';
import Search from '@material-ui/icons/Search';

interface IFilter {
    id: string;
    custom: boolean;
}

interface IProps {
    values: string[];
    options: string[];
    onChange: (v: string[]) => void;
    onCustom: (v: string) => void;
    getLabel: (v: string) => string;
}

const filter = createFilterOptions<IFilter>();

export const AutoCompleteCustom: React.FC<IProps> = (props) => {
    const {onChange, onCustom, values, options, getLabel} = props;

    const optionsOverride = options
        .map(id => ({
            id,
            custom: false,
        }));

    const valuesOverride = values.map(n => ({id: n, custom: false}));

    return (
        <Autocomplete
            multiple
            openOnFocus={false}
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
                        id: params.inputValue,
                    });
                }

                return filtered;
            }}
            getOptionSelected={(v) => valuesOverride.some(o => o.id === v.id)}
            value={valuesOverride}
            options={optionsOverride}
            renderOption={({custom, id}) => custom
                ? <Button color="secondary" variant="contained">{`Custom order: ${id}`}</Button>
                : <Typography noWrap>{getLabel(id).replace(/\s/g, ' ')}</Typography>}
            getOptionLabel={({id: itemId, custom}) => !custom ? getLabel(itemId).replace(/\s/g, ' ') : itemId}
            renderInput={(params) => {
                params.InputProps.endAdornment = <Search style={{marginRight: -48}} />;
                return (
                    <TextField
                        label="Search"
                        {...params}
                        variant="outlined" />
                );
            }}
        />
    );
};
