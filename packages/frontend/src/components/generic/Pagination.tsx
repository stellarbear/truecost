import React, {createContext, useEffect} from "react";
import {useQuery} from "react-apollo";
import {Grid, IconButton, MenuItem, Select, Typography} from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import {getResolverName} from "auxiliary";
import {Storage} from "auxiliary/storage";

interface PaginationProps {
    recordCount?: number;
    head?: JSX.Element;
    body: JSX.Element;
    noCache?: boolean;
    pack?: string;
    query: any;
}

export interface PaginationChildProps {
    updateQueryParams: (newParams: Record<string, any>) => void;
    refetchQueryForce: () => void;
    refetchQuery: () => void;
    items: any[];
}

export const PaginationContext = createContext<PaginationChildProps>({
    updateQueryParams: (newParams: Record<string, any>) => {
    },
    refetchQueryForce: () => {
    },
    refetchQuery: () => {
    },
    items: [],
});

//	There is a problem when we add or delete an item => cache is not updating
//	https://github.com/apollographql/apollo-feature-requests/issues/4#issuecomment-431119231
const Pagination: React.FC<PaginationProps> = ({
    body,
    query,
    pack,
    head = null,
    noCache = false,
    recordCount = 0,
}): JSX.Element => {
    const storageKey = ["admin", "pagination", "records"];
    const [items, setItems] = React.useState<any[]>([]);
    const [count, setCount] = React.useState<number>(0);
    const [skip, setSkip] = React.useState<number>(0);
    const [queryParams, setQueryParams] = React.useState<Record<string, any>>();
    const [take, setTake] = React.useState<number>(Storage.getItem(storageKey, recordCount) || 4);

    const queryResponse = getResolverName(query);
    const queryVariables = pack == undefined ? {...queryParams} : {[pack]: {...queryParams}};
    const {data, refetch, client} = useQuery(query, {
        variables: {take, skip, ...queryVariables},
        fetchPolicy: noCache ? "network-only" : "cache-first",
        ssr: false,
    });

    useEffect(() => {
        if (data && data[queryResponse]
            && data[queryResponse].items !== undefined
            && data[queryResponse].count !== undefined) {

            const array = data[queryResponse].items;
            const count = data[queryResponse].count;

            console.log("query sent", {take, skip, ...queryVariables});
            console.log("response received", array);

            setItems(array);
            setCount(count);
        }
    }, [data]);

    const updateNumberOfRecords = (count: number) => {
        Storage.setItem(storageKey, count);
        setTake(count);
    };

    const refetchQuery = async () => {
        await client.resetStore();
        await refetch();
    };

    const refetchQueryForce = async () => {
        data.corrupted = true;

        await refetchQuery();
    };

    const updateQueryParams = (newParams: Record<string, any>) =>
        setQueryParams(newParams);

    const onFirstPage = () => {
        setSkip(0);
    };

    const onPreviousPage = () => {
        const currentPage = Math.ceil(skip / take);
        const previousPage = currentPage > 0 ? currentPage - 1 : 0;
        setSkip(previousPage * take);
    };

    const onNextPage = () => {
        const pageCount = Math.ceil(count / take) - 1;
        const currentPage = Math.ceil(skip / take);
        const nextPage = currentPage < pageCount ? currentPage + 1 : pageCount;
        setSkip(nextPage * take);
    };

    const onLastPage = () => {
        const lastPage = Math.ceil(count / take) - 1;
        setSkip(lastPage * take);
    };

    const buildControls = () => {
        const currentPage = Math.ceil(skip / take);
        const pageCount = Math.ceil(count / take) - 1;
        const from = currentPage * take + 1;
        const to = (currentPage + 1) * take;

        const canFirst = currentPage > 0;
        const canPrevious = currentPage > 0;
        const canNext = currentPage < pageCount;
        const canLast = currentPage < pageCount;


        const info = `${from}-${to > count ? count : to} of ${count}`;
        return (
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center">
                <Select
                    disableUnderline
                    value={take}
                    renderValue={val => `${val} items`}
                    onChange={(event: React.ChangeEvent<{name?: string; value: any}>) => updateNumberOfRecords(event.target.value as number)}
                >
                    {[4, 8, 16, 48, 128].map((num: number, index: number) => <MenuItem key={index}
                        value={num}>{num}</MenuItem>)}
                </Select>
                <IconButton onClick={() => onFirstPage()} disabled={!canFirst}>
                    <FirstPage />
                </IconButton>
                <IconButton onClick={() => onPreviousPage()} disabled={!canPrevious}>
                    <ChevronLeft />
                </IconButton>
                <Typography>{info}</Typography>
                <IconButton onClick={() => onNextPage()} disabled={!canNext}>
                    <ChevronRight />
                </IconButton>
                <IconButton onClick={() => onLastPage()} disabled={!canLast}>
                    <LastPage />
                </IconButton>
            </Grid>
        );
    };

    return (
        <PaginationContext.Provider value={{updateQueryParams, items, refetchQuery, refetchQueryForce}}>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center">
                {head}
                {buildControls()}
                {body}
            </Grid>
        </PaginationContext.Provider>
    );
};


export default Pagination;
