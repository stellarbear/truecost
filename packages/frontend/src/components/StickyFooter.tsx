import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import {Grid, TextField} from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
        },
        main: {
            marginTop: theme.spacing(8),
            marginBottom: theme.spacing(2),
        },
        footer: {
            padding: theme.spacing(2),
            marginTop: 'auto',
            backgroundColor: 'white',
        },
    }),
);

function Copyright() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="firstName"
                    name="firstName"
                    label="First name"
                    fullWidth
                    autoComplete="fname"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="lastName"
                    name="lastName"
                    label="Last name"
                    fullWidth
                    autoComplete="lname"
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="https://material-ui.com/">
                        Your Website
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Grid>
        </Grid>
    );
}


export default function StickyFooter() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <footer className={classes.footer}>
                <Container maxWidth="sm">
                    <Typography variant="body1">My sticky footer can be found here.</Typography>
                    <Copyright/>
                </Container>
            </footer>
        </div>
    );
}
