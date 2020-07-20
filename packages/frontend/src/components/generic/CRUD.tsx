import * as React from "react";

import {ItemProp} from "components/generic/types";
import {Filter} from "components/generic/Filter";
import {List} from "components/generic/List";
import {Add} from "components/generic/Add";
import {Row, Col} from "pages/Base/Grid";
import {ApolloQueryResult, NetworkStatus} from "apollo-boost";
import {createContext} from "react";

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

export type IShared = [ISharedData, React.Dispatch<React.SetStateAction<ISharedData>>]
export interface ISharedData {
    vars: any
    fetch?: () => Promise<ApolloQueryResult<any>>
}
const SharedContext = createContext({} as IShared);
export const useShared = () => React.useContext(SharedContext)

export const CRUD: React.FC<ICRUD> = ({
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
    const shared = React.useState<ISharedData>({vars: {}})

    return (
        <SharedContext.Provider value={shared}>
            <Col s={8} fullWidth>
                <Row s={8}>
                    <Filter
                        props={propsFilter}
                    />
                    <Add
                        mutation={mutationUpsert}
                        props={propsAdd}
                    />
                </Row>
                <List
                    props={propsList}
                    listQuery={queryGet}
                    updateMutation={mutationUpsert}
                    removeMutation={mutationDelete}
                />
            </Col>
        </SharedContext.Provider>
    );
};
