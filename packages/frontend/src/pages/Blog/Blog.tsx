import {gql, useQuery} from '@apollo/client';
import {CircularProgress} from '@material-ui/core';
import {IBlog} from '@truecost/shared';
import {Col, RowGrid} from 'pages/Base/Grid';
import {Meta} from 'pages/Base/Meta';
import TextCard from 'pages/Base/TextCard';
import * as React from 'react';
import {BlogCard} from './BlogCard';

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
        }
    }
`;

export const Blog: React.FC = () => {
    const {data, error, loading} = useQuery(GET_ALL_BLOG);

    if (error || loading || !data.BlogAll) {
        return (
            <TextCard title="Blog" data={[]}>
                <CircularProgress />;
            </TextCard>
        );
    }

    const blogs: IBlog[] = data.BlogAll.filter((d: any) => d.active);
    blogs.sort((a, b) => a.order - b.order);

    const top = blogs.shift();

    return (
        <>
            <Meta />
            <TextCard title="Blog" data={[]}>
                <Col s={16}>
                    {top && (
                        <BlogCard
                            key={top.id}
                            blog={top} />
                    )}
                    <RowGrid w={250} s={16} p={16}>
                        {blogs.map(b => (
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