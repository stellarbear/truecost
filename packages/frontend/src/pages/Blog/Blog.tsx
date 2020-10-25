import {gql, useQuery} from '@apollo/client';
import {CircularProgress} from '@material-ui/core';
import {IBlog} from '@truecost/shared';
import {Col, RowGrid} from 'pages/Base/Grid';
import {Meta} from 'pages/Base/Meta';
import TextCard from 'pages/Base/TextCard';
import * as React from 'react';
import {BlogCard} from './BlogCard';
import {BlogFilter} from './BlogFilter';

const GET_ALL_BLOG = gql`
    query BlogAll {
        BlogAll {
            id
            name
            url
            date
            active
            preview
            images

            game { id }
        }
    }
`;

export const Blog: React.FC = () => {
    const {data, error, loading} = useQuery(GET_ALL_BLOG);
    const [filter, setFilter] = React.useState("");

    if (error || loading || !data.BlogAll) {
        return (
            <TextCard title="Blog" data={[]}>
                <CircularProgress />;
            </TextCard>
        );
    }

    const blogs: IBlog[] = data.BlogAll.filter((d: any) => d.active);
    blogs.sort((a, b) => a.order - b.order);

    const filtered = filter === "" ? blogs : blogs.filter(b => b.game?.id === filter);
    const top = filtered[0];
    const others = filtered.slice(1);

    return (
        <>
            <Meta />
            <TextCard title="Articles" data={[]}>
                <Col s={16}>
                    <BlogFilter
                        blogs={blogs}
                        filter={filter}
                        setFilter={setFilter}
                    />
                    {top && (
                        <BlogCard
                            key={top.id}
                            blog={top} />
                    )}
                    <RowGrid w={250} s={16} p={16}>
                        {others.map(b => (
                            <BlogCard
                                key={b.id}
                                blog={b} />
                        ))}
                    </RowGrid>
                </Col>
            </TextCard>
        </>
    );
};