import {
    Chip,
    CircularProgress,
    createStyles,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Theme,
} from "@material-ui/core";
import * as React from "react";
import {SelectProps} from "@material-ui/core/Select";
import {useLazyQuery} from "react-apollo";
import gql from "graphql-tag";
import ListSubheader from '@material-ui/core/ListSubheader';

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
        },
    },
};
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        outer: {
            width: "100%",
            height: 60,
            minHeight: 44,
            marginTop: -1,
        },
        inner: {
            display: "flex",
            overflow: "hidden",
        },
        chip: {
            marginRight: 4,
        },
    }),
);

const buildQuery = (query: IQuery) => gql`
    query ${query.name} {
        ${query.name} {
        id
        name
        ${query.field ? `${query.field} { id }` : ''}
    }
    }
`;

export interface IQuery {
    name: string;
    field?: string;
}

interface ISelectQueryFieldProps extends SelectProps {
    disabled?: boolean;
    label?: string;
    propName?: string;
    query: IQuery;
    record: Record<string, any>;
    multiple?: boolean;
    preRenderMap: Record<string, any>;
    onChangeEvent: (value: any) => void;
}

const sort = (array: Record<string, string>[], propName: string): any[] =>
    array.sort((a, b) => a[propName].localeCompare(b[propName]));

const filter = (array: Record<string, any>[], query: IQuery, record: Record<string, any>): any[] =>
    array.filter(cur => {
        if (query.field && record) {
            const {field} = query;
            if (record[field] && cur[field]) {
                if (record[field] === cur[field].id ||
                    record[field].id === cur[field].id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    });


const SelectQueryField: React.FC<ISelectQueryFieldProps> = ({
    label,
    query,
    record,
    disabled = false,
    preRenderMap,
    onChangeEvent,
    multiple = false,
    propName = "name",
    ...rest
}) => {
    const classes = useStyles();
    const [lazy, {called, data, loading}] = useLazyQuery(buildQuery(query));
    const renderMap = data == undefined
        ? {...preRenderMap}
        : data[query.name].reduce((obj: any, cur: any) => {
            obj[cur.id] = cur.name;
            return obj;
        }, {...preRenderMap});

    const onSelectOpen = () => data || lazy();

    const buildChip = (selected: any) => (
        <Chip
            clickable
            key={selected}
            className={classes.chip}
            label={renderMap[selected]}
        //onDelete={() => onDelete(selected)}
        />
    );
    const {value} = rest;
    const count = Array.isArray(value) ? value.length : 0;
    const filtered = filter(data?.[query.name] || [], query, record);
    return (
        <FormControl
            className={classes.outer}>
            {label ? <InputLabel
                onClick={() => console.log('ck')}>{count ? `${label}: ${count}` : label}</InputLabel> : null}
            <Select
                fullWidth
                disabled={disabled}
                multiple
                value={value}
                {...rest}
                MenuProps={MenuProps}
                onOpen={onSelectOpen}
                onChange={(event: React.ChangeEvent<{
                    name?: string | undefined;
                    value: unknown;
                }>) => {
                    const newState = event.target.value as (string | undefined)[];
                    if (newState.includes(undefined)) {
                        return;
                    }
                    if (multiple) {
                        onChangeEvent(newState);
                    } else {
                        const prevState = value as string[];
                        onChangeEvent(newState.filter(e => !prevState.includes(e as string)));
                    }
                }}
                renderValue={(selected: any) => (
                    <div className={classes.inner}>
                        {
                            Array.isArray(selected)
                                ? (selected as any[]).map((selectedValue: any) => buildChip(selectedValue))
                                : buildChip(selected)
                        }
                    </div>
                )}
            >
                {loading || !called
                    ? <CircularProgress />
                    : data[query.name].length == 0
                        ? <ListSubheader style={{outline: "none"}}>No options</ListSubheader>
                        : filtered.length > 0
                            ? sort(filtered, propName).map((value: any) => (
                                <MenuItem key={value.id} value={value.id}>
                                    {value[propName]}
                                </MenuItem>
                            ))
                            : query.field
                                ? <ListSubheader style={{outline: "none"}}>{`${query.field} not set`}</ListSubheader>
                                : <ListSubheader style={{outline: "none"}}>No options</ListSubheader>}
            </Select>
        </FormControl>
    );
};

export default SelectQueryField;
