import {CircularProgress, Select, TextField, Typography} from "@material-ui/core";
import * as React from "react";
import {SelectProps} from "@material-ui/core/Select";
import {useEventState} from "../../../auxiliary/useEventState";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {gql, useLazyQuery} from "@apollo/client";

export interface IOption {
    id: string;
    [key: string]: any;
}

export type IOptions = IOption | IOption[];

interface IProps extends SelectProps {
    multiple: boolean;
    query: IQuery;
    path: string;
    label?: string;
    value: IOptions;
    readOnly?: boolean;
    record: Record<string, any>;
    onChangeEvent: (value: IOptions) => void;
}

export interface IQuery {
    name: string;
    fields?: string[];
}

const buildQuery = (query: IQuery, path: string) => gql`
    query ${query.name} {
        ${query.name} {
        id
        ${path}
        ${(query.fields || []).map(f => `${f} { id }`)}
    }
    }
`;
const array = (src: any) => Array.isArray(src) ? src : [src];
const intersect = (src: any[], dst: any[]) => {
    src = array(src).map((e: any) => e.id);
    dst = array(dst).map((e: any) => e.id);
    return src.some(s => dst.includes(s));
};

const filter = (record: Record<string, any>, data: any, query: IQuery) => {
    const options = data?.[query.name] || [];
    const fields = query.fields || [];

    return options.filter((option: any) => {
        for (const field of fields) {
            if (!intersect(record[field], option[field])) {
                return false;
            }
        }

        return true;
    });
};

export const SelectFieldAsync: React.FC<IProps> = (props) => {
    const {
        query,
        path,
        readOnly = false,
        multiple = false,
        onChangeEvent,
        value,
        record,
    } = props;
    const [lazy, {data, loading}] = useLazyQuery(buildQuery(query, path));
    const {state, setAndBubbleState} = useEventState(value, onChangeEvent);

    const missing = (query.fields || [])
        .filter(f => !(f in record) || !(record[f] && 'id' in record[f]));
    if (missing.length > 0) {
        return <Typography>{`Select ${missing.join(', ')} first`}</Typography>;
    }

    const filtered = filter(record, data, query);
    return (
        <Autocomplete
            disabled={readOnly}
            disableCloseOnSelect={multiple}
            size="small"
            loading={loading}
            style={{minWidth: 300}}
            onFocus={() => data || lazy()}
            multiple={multiple}
            value={state}
            onChange={(_, newValue: any) => setAndBubbleState(newValue)}
            getOptionSelected={(option, value) => option.id === value.id}
            options={filtered}
            getOptionLabel={(option: IOption) => option[path]}
            fullWidth
            renderInput={(params) =>
                <TextField {...params} variant="outlined"
                           InputProps={{
                               ...params.InputProps,
                               endAdornment: (
                                   <React.Fragment>
                                       {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                       {params.InputProps.endAdornment}
                                   </React.Fragment>
                               ),
                           }}
                />}
        />
    );
};

export default Select;
