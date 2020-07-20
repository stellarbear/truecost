import * as React from "react";

import {ItemProp} from "components/generic/types";
import {Filter} from "components/generic/Filter";
import {List} from "components/generic/List";
import {Add} from "components/generic/Add";
import {Row, Col} from "pages/Base/Grid";

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
    return (
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
    );
};

export default CRUD;
