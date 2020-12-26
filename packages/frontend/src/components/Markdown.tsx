import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core';
import ReactMarkdown, {MarkdownToJSX} from 'markdown-to-jsx';

const useStyles = makeStyles({
    scale: {
        fontSize: "1.5rem",
        "& *": {
            fontSize: "1.5rem",
        },
    },
});

const Wrapper: React.FC = (props) => <Typography variant="caption" {...props} />;

const options: MarkdownToJSX.Options = ({
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
            props: {variant: 'body1'},
        },
        p: {component: Typography, props: {paragraph: true}},
        a: {component: Link},
    },
    wrapper: Wrapper,
});

interface IProps {
    children: string;
    scale?: boolean;
    style?: React.CSSProperties;
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
