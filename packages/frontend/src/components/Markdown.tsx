import React from 'react';
import ReactMarkdown, {MarkdownProps} from 'markdown-to-jsx';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

/*
const styles = theme => ({
    listItem: {
        marginTop: theme.spacing(1),
    },
});*/

const options = {
    overrides: {
        h1: {
            component: Typography,
            props: {
                gutterBottom: true,
                variant: 'h5',
            },
        },
        h2: {component: Typography, props: {variant: 'h6'}},
        h3: {component: Typography, props: {variant: 'subtitle1'}},
        h4: {
            component: Typography,
            props: {variant: 'caption', paragraph: true},
        },
        span: {
            component: Typography,
            props: {variant: 'caption'},
        },
        p: {component: Typography, props: {paragraph: true}},
        a: {component: Link},
        /*li: {
            component: withStyles(styles)(({ classes, ...props }) => (
                <li className={classes.listItem}>
                    <Typography component="span" {...props} />
                </li>
            )),
        },*/
    },
};

const Markdown: React.FC<MarkdownProps> = (props) => (
    <ReactMarkdown
        options={options}
        {...props} />
);

export default Markdown;
