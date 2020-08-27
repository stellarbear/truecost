import React from 'react';
import {Helmet} from 'react-helmet';
import {Dict} from '@truecost/shared';
import {useStore} from 'pages/Data/Wrapper';
import {useHistory} from 'react-router';
import {IMeta} from 'pages/Data/useMeta';

interface IProps {
    path?: string
    entity?: Dict<any>
}

const parse = (src: string, entity: Dict<any>): string => {
    let result = src;

    while (true) {
        console.log(result);
        const start = result.indexOf('{');
        const end = result.indexOf('}');

        if (start === -1 || end === -1 || start > end) {
            return result;
        }

        const prop = result.slice(start + 1, end);
        result = result.slice(0, start) + (entity[prop] || "") + result.slice(end + 1)
    }
}

const getMetaTags = (meta: Dict<IMeta>, path: string): Dict<any> => {
    if (path in meta) {
        return meta[path].tags;
    }

    const overlaps = []
    for (let key in meta) {
        if (path.startsWith(key)) {
            overlaps.push(key);
        }
    }

    if (overlaps.length > 0) {
        let max = overlaps[0];

        for (let overlap of overlaps) {
            if (overlap.length > max.length) {
                max = overlap;
            }
        }

        return meta[max].tags;
    }

    return {};
}

export const Meta: React.FC<IProps> = (props) => {
    const {current: {game: {url: gameUrl}}, meta} = useStore();
    const {location: {pathname: browserUrl}} = useHistory()

    const preUrl = browserUrl.startsWith('/' + gameUrl)
        ? browserUrl.slice(1 + gameUrl.length)
        : browserUrl;
    const url = preUrl.startsWith('/')
        ? preUrl
        : '/' + preUrl;

    const {
        path = url,
        entity = {}
    } = props;

    const tags = getMetaTags(meta, path);

    console.log(tags);
    const data = Object.keys(tags).map(key => ({
        path: key,
        value: parse(tags[key], entity)
    }));

    return (
        <Helmet>
            {
                data.map(({path, value}) => (
                    path === "title"
                        ? <title key={path}>{value}</title>
                        : <meta key={path} name={path} content={value} />
                ))
            }
        </Helmet>
    );
};