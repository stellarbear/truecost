import * as React from "react";
import {Button, createStyles, Divider, IconButton, makeStyles, Theme, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import {social} from "auxiliary/social";
import SocialDialog from "./SocialDialog";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            flexDirection: "row",
            [theme.breakpoints.down(658)]: {
                flexDirection: "column-reverse",
            },
        },
        divider: {
            width: "100%", backgroundColor: "#ddda",
            [theme.breakpoints.down(658)]: {
                height: 1,
            },
            [theme.breakpoints.up(658)]: {
                height: 0,
            },
        },
        links: {
            [theme.breakpoints.down(658)]: {
                alignItems: "center",
            },
            [theme.breakpoints.up(658)]: {
                alignItems: "flex-end",
            },
        },
    }),
);

interface FooterProps {
}

//https://www.kobzarev.com/programming/links-to-whatsapp-and-telegram/
const Footer: React.FC<FooterProps> =
    ({}): JSX.Element => {
        const classes = useStyles();

        return (
            <div className={classes.margin} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", flex: "0 0 auto",
                padding: 16, paddingBottom: 0,
                borderRadius: "6px 6px 0px 0px",
                position: "relative",
                zIndex: 3,
                color: "#fff",
                backgroundColor: "#263238",
            }}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Divider className={classes.divider}/>
                    <Typography variant="body1" color="inherit" style={{margin: 8}}>© Truecost 2019-2020</Typography>
                    <Divider className={classes.divider}/>
                    <Typography variant="body1" color="inherit" style={{textAlign: "center", margin: 8}}>2885 Sanford
                        Ave SW #46305 Grandville, MI 49418</Typography>
                    <Divider className={classes.divider}/>
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap",
                    }}>
                        {
                            social.map((item, index) => (
                                <SocialDialog key={`social-${index}`} button={
                                    (
                                        <IconButton color="inherit">
                                            {React.cloneElement(item.icon, {style: {color: "white"}})}
                                        </IconButton>
                                    )
                                } {...item} />
                            ))
                        }
                    </div>
                </div>
                <div className={classes.links} style={{display: "flex", flexDirection: "column"}}>
                    <Button color="inherit" component={Link} to={"/about"}>About us</Button>
                    <Button color="inherit" component={Link} to={"/policy"}>Privacy policy</Button>
                    <Button color="inherit" component={Link} to={"/tos"}>Terms of Service</Button>
                </div>
            </div>
        );
    };


export default Footer;
