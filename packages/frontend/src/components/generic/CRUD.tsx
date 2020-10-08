import * as React from "react";
import {createContext} from "react";

import {ItemProp} from "components/generic/types";
import {Filter} from "components/generic/Filter";
import {List} from "components/generic/List";
import {Add} from "components/generic/Add";
import {Col, Row} from "pages/Base/Grid";

interface ICRUD {
    title: string;
    queryGet: any;
    mutationDelete: any;
    mutationUpsert: any;
    propsAdd?: ItemProp[];
    propsList?: ItemProp[];
    propsFilter?: ItemProp[];
}

export type IShared = [ISharedData, React.Dispatch<React.SetStateAction<ISharedData>>];

export interface ISharedData {
    vars: any;
}

const SharedContext = createContext({} as IShared);
export const useShared = () => React.useContext(SharedContext);

export const CRUD: React.FC<ICRUD> = (props) => {
    const {
        title,
        queryGet,
        mutationDelete,
        mutationUpsert,
        propsAdd = [],
        propsList = [],
        propsFilter = [],
    } = props;
    const shared = React.useState<ISharedData>({vars: {}});

    return (
        <SharedContext.Provider value={shared}>
            <Col s={8}>
                <Row s={8} justify="center">
                    <Filter
                        title={title}
                        propsFilter={propsFilter}
                    />
                    <Add
                        mutation={mutationUpsert}
                        propsAdd={propsAdd}
                    />
                </Row>
                <List
                    title={title}
                    propsList={propsList}
                    listQuery={queryGet}
                    updateMutation={mutationUpsert}
                    removeMutation={mutationDelete}
                />
            </Col>
        </SharedContext.Provider>
    );
};
