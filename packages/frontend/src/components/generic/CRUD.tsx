import * as React from "react";

import {ItemProp} from "components/generic/types";
import Pagination from "components/generic/Pagination";
import Filter from "components/generic/Filter";
import List from "components/generic/List";
import Add from "components/generic/Add";

interface ICRUD {
    title: string;
    pack?: string;
    tree?: string;
    visibleKeys?: string[];
    queryGet: any;
    mutationDelete: any;
    mutationUpsert: any;
    propsAdd: ItemProp[];
    propsList: ItemProp[];
    propsFilter: ItemProp[];
}

const CRUD: React.FC<ICRUD> = ({
                                   pack,
                                   tree,
                                   title,
                                   visibleKeys,
                                   queryGet,
                                   mutationDelete,
                                   mutationUpsert,
                                   propsAdd,
                                   propsList,
                                   propsFilter,
                               }) => {

    const buildAdd = () => {
        return (
            propsAdd.length > 0
                ? (
                    <Add
                        pack={pack}
                        title={`Create ${title}`}
                        props={propsAdd}
                        placement={"top"}
                        createItem={mutationUpsert}
                    />
                )
                : null
        );
    };

    const buildClone = (def: {}) => {
        return (propsAdd.length > 0
                ? (
                    <Add
                        def={def}
                        pack={pack}
                        title={`Clone ${title}`}
                        props={propsAdd}
                        placement={"bottom"}
                        createItem={mutationUpsert}
                    />
                )
                : null
        );
    };
    const buildFilter = () => {
        return (
            <Filter
                title={title}
                props={propsFilter}
            />
        );
    };
    const buildList = () => {
        return (
            <List
                pack={pack}
                title={title}
                visibleKeys={visibleKeys}
                actionsGlobal={[buildAdd]}
                actionsLocal={[buildClone]}
                props={propsList}
                updateMutation={mutationUpsert}
                deleteMutation={mutationDelete}
            />
        );
    };

    return (
        <Pagination
            pack={pack}
            noCache
            query={queryGet}
            head={buildFilter()}
            body={buildList()}
        />
    );
};

export default CRUD;
