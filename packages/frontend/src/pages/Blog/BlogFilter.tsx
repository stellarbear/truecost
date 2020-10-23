import {Button} from '@material-ui/core';
import {IBlog} from '@truecost/shared';
import {Row} from 'pages/Base/Grid';
import {useStore} from 'pages/Data/Wrapper';
import * as React from 'react';

interface IProps {
    filter: string;
    setFilter: (f: string) => void;
    blogs: IBlog[];
}

export const BlogFilter: React.FC<IProps> = (props) => {
    const {filter, setFilter, blogs} = props;
    const {games} = useStore();

    const options = Array.from(
        new Set(
            blogs
                .map(b => b.game?.id)
                .filter(x => x) as string[],
        ),
    );

    return (
        <Row wrap>
            <Button
                color="primary"
                style={{margin: 4}}
                onClick={() => setFilter("")}
                variant={"" === filter ? "contained" : "outlined"}>
                All
            </Button>
            {options.map((id) => (
                <Button
                    key={id}
                    style={{margin: 4}}
                    color="primary"
                    onClick={() => setFilter(id)}
                    variant={id === filter ? "contained" : "outlined"}>
                    {games.id[id].name}
                </Button>
            ))}
        </Row>
    );
};