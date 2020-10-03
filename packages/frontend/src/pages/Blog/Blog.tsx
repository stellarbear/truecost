import {gql, useQuery} from '@apollo/client';
import {CircularProgress} from '@material-ui/core';
import {IBlog} from '@truecost/shared';
import {Col} from 'pages/Base/Grid';
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
    blogs.sort((a, b) => a.date - b.date);

    return (
        <>
            <Meta />
            <TextCard title="Blog" data={[]}>
                <Col fullWidth>
                    {blogs.map(b => (
                        <BlogCard
                            key={b.id}
                            blog={b} />
                    ))}
                </Col>
            </TextCard>
        </>
    );
};