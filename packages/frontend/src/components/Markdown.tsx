import React from 'react';
import ReactMarkdown, {MarkdownProps} from 'markdown-to-jsx';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const options = (scale: boolean) => {
    const props = scale ? {
        style: {fontSize: "1.5em"},
    } : {};

    return ({
        overrides: {
            h1: {
                component: Typography,
                props: {
                    gutterBottom: true,
                    variant: 'h5',
                    ...props,
                },
            },
            h2: {component: Typography, props: {gutterBottom: true, variant: 'h6', ...props}},
            h3: {component: Typography, props: {gutterBottom: true, variant: 'subtitle1', ...props}},
            h4: {
                component: Typography,
                props: {gutterBottom: true, variant: 'caption', paragraph: true, ...props},
            },
            span: {
                component: Typography,
                props: {variant: 'caption', ...props},
            },
            p: {component: Typography, props: {paragraph: true, ...props}},
            a: {component: Link, props: {...props}},
        },
    });
};

interface IProps extends MarkdownProps {
    scale?: boolean;
}

export const Markdown: React.FC<IProps> = ({scale = false, ...rest}) => (
    <ReactMarkdown
        options={options(scale)}
        {...rest} />
);
