import React, {useEffect, useState} from "react";
import {
    Button,
    createStyles,
    Hidden,
    IconButton,
    makeStyles,
    MenuItem,
    Select,
    Theme,
    Typography,
} from "@material-ui/core";
import {ChevronLeft, ChevronRight, FirstPage, LastPage} from "@material-ui/icons";
import {Storage} from "auxiliary/storage";
import ItemCard from "./ItemCard";
import PassCard from "./PassCard";
import {baseGame} from "auxiliary/route";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            boxShadow:
                "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
            [theme.breakpoints.down(658)]: {
                margin: "10px 10px 0px",
            },
            [theme.breakpoints.up(658)]: {
                margin: "30px 30px 0px",
            },
            [theme.breakpoints.up(1600)]: {
                margin: "30px auto",
            },
        },
    }),
);

interface IPaginationProps {
    ids: string[];
    deps?: any[];
}

interface IState {
    skip: number;
    take: number;
}

export const defaultPaginationState: IState = {
    skip: 0,
    take: 18,
};

export const storagePaginationKey = ["shop", "pagination"];
const Pagination: React.FC<IPaginationProps> = (props) => {
    const {
        ids,
        deps = [],
    } = props;
    const classes = useStyles();

    let mounted = false;
    const count = ids.length;
    const [state, setState] = useState<IState>(Storage.getItem(storagePaginationKey, defaultPaginationState));

    const onStateChange = (key: keyof IState, value: any) => {
        if (key === "skip") {
            window.scroll({top: 0, left: 0, behavior: "smooth"});
            value *= state.take;
        }

        const newState = {...state, [key]: value};
        Storage.setItem(storagePaginationKey, newState);
        setState(newState);
    };

    useEffect(() => {
        mounted = true;
        const newState: IState = Storage.getItem(storagePaginationKey, defaultPaginationState);
        setState(newState);
    }, []);

    useEffect(() => {
        if (!mounted) {
            onStateChange("skip", 0);
        }
    }, [deps.join('')]);

    const buildControls = (side: -1 | 0 | 1) => {
        const {take, skip} = state;
        const currentPage = Math.ceil(skip / take);
        const pageCount = Math.ceil(count / take) - 1;

        const canFirst = currentPage > 0;
        const canPrevious = currentPage > 0;
        const canNext = currentPage < pageCount;
        const canLast = currentPage < pageCount;

        const pageLength = 5;
        let localPages = new Array(pageLength).fill(0).map((e, i) => currentPage - 2 + i);
        if (localPages[0] < 0) {
            localPages = localPages.map(p => p - localPages[0]);
        }
        if (localPages[pageLength - 1] > pageCount) {
            localPages = localPages.map(p => p - (localPages[pageLength - 1] - pageCount));
        }
        localPages = localPages.filter((p) => p >= 0 && p <= pageCount);

        const renderItemsCount = () => (
            <Select
                value={take}
                disableUnderline
                renderValue={val => `${val} items`}
                MenuProps={{disableScrollLock: true}}
                onChange={(event: React.ChangeEvent<{ name?: string; value: any }>) => onStateChange("take", event.target.value as number)}
            >
                {[9, 18, 36, 108].map((num: number, index: number) => <MenuItem key={index}
                                                                                value={num}>{num}</MenuItem>)}
            </Select>
        );
        const renderToFirstPage = () => (
            <IconButton onClick={() => onStateChange("skip", 0)} disabled={!canFirst}>
                <FirstPage/>
            </IconButton>
        );
        const renderToPreviousPage = () => (
            <IconButton onClick={() => onStateChange("skip", currentPage > 0 ? currentPage - 1 : 0)}
                        disabled={!canPrevious}>
                <ChevronLeft/>
            </IconButton>
        );
        const renderToNextPage = () => (
            <IconButton onClick={() => onStateChange("skip", currentPage < pageCount ? currentPage + 1 : pageCount)}
                        disabled={!canNext}>
                <ChevronRight/>
            </IconButton>
        );
        const renderToLastPage = () => (
            <IconButton onClick={() => onStateChange("skip", pageCount)} disabled={!canLast}>
                <LastPage/>
            </IconButton>
        );

        const renderPages = () => (
            <React.Fragment>
                {localPages.map(p => (
                    <Button
                        variant="contained"
                        color={p === currentPage ? "primary" : "inherit"} key={`page-${p}`}
                        style={{minWidth: 28, padding: 4, margin: 4, borderRadius: 36, width: 28}}
                        onClick={() => onStateChange("skip", p)}>{p + 1}</Button>
                ))}
            </React.Fragment>
        );

        const renderSmall = () => (
            <div style={{
                marginTop: 8 * side, marginBottom: -8 * side,
            }}>
                <div
                    style={{
                        display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",
                    }}>
                    {renderToFirstPage()}
                    {renderItemsCount()}
                    {renderToLastPage()}
                </div>
                <div
                    style={{
                        display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",
                    }}>
                    {renderToPreviousPage()}
                    {renderPages()}
                    {renderToNextPage()}
                </div>
            </div>
        );
        const renderFull = () => (
            <div
                style={{
                    marginTop: 8 * side, marginBottom: -8 * side,
                    display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",
                }}>
                {renderItemsCount()}
                {renderToFirstPage()}
                {renderToPreviousPage()}
                {renderPages()}
                {renderToNextPage()}
                {renderToLastPage()}
            </div>
        );

        return (
            <React.Fragment>
                <Hidden smDown>
                    {renderFull()}
                </Hidden>
                <Hidden mdUp>
                    {renderSmall()}
                </Hidden>
            </React.Fragment>
        );
    };

    const renderItems = (ids: string[]) => {
        return (
            <div
                //className={classes.margin}
                style={{
                    padding: 8,
                    justifyContent: "center",
                    display: "grid",
                    overflow: "hidden",
                    gridTemplateColumns: "repeat(auto-fill, 300px)",
                    gridRowGap: 16,
                    gridColumnGap: 16,
                }}>
                {
                    ids.map(id =>
                        <ItemCard key={id} id={id}/>,
                    )
                }
            </div>
        );
    };

    const buildItems = () => {
        if (ids.length === 0) {
            return (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 10,
                }}>
                    <img className="float" style={{
                        minWidth: 80,
                        width: 80, height: 80, objectFit: "cover", margin: 8, marginLeft: 0,
                    }} src={`/${baseGame}/pass.png`}/>
                    <div style={{marginLeft: 8}}>
                        <Typography>Unfortunately, nothing was found</Typography>
                        <Typography>Try next time or change some filters</Typography>
                    </div>
                </div>
            );
        }

        const {take, skip} = state;
        const prefix = ids.filter((_, i) => i >= skip && i < skip + take && i < 6 + skip);
        const suffix = ids.filter((_, i) => i >= skip && i < skip + take && i >= 6 + skip);
        return (
            <React.Fragment>
                {renderItems(prefix)}
                {prefix.length >= 6 && <PassCard/>}
                {renderItems(suffix)}
            </React.Fragment>
        );
    };

    return (
        <div>
            {buildControls(1)}
            {buildItems()}
            {count >= 9 && buildControls(-1)}
        </div>
    );
};


export default Pagination;
