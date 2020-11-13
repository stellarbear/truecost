import React from 'react';
import ReactMarkdown, {MarkdownProps} from 'markdown-to-jsx';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
    scale: {
        fontSize: "1.5rem",
        "& *": {
            fontSize: "1.5rem",
        },
    },
});

const options = ({
    overrides: {
        h1: {
            component: Typography,
            props: {
                gutterBottom: true,
                variant: 'h5',
            },
        },
        h2: {component: Typography, props: {gutterBottom: true, variant: 'h6'}},
        h3: {component: Typography, props: {gutterBottom: true, variant: 'subtitle1'}},
        h4: {
            component: Typography,
            props: {gutterBottom: true, variant: 'caption', paragraph: true},
        },
        span: {
            component: Typography,
            props: {variant: 'caption'},
        },
        p: {component: Typography, props: {paragraph: true}},
        a: {component: Link},
    },
});

interface IProps extends MarkdownProps {
    scale?: boolean;
}

export const Markdown: React.FC<IProps> = ({scale = false, ...rest}) => {
    const classes = useStyles();

    rest.style = {
        fontFamily: 'Roboto',
        ...rest.style, 
    };

    return (
        <ReactMarkdown
            className={scale ? classes.scale : undefined}
            options={options}
            {...rest} />
    );
};
