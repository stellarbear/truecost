import * as React from "react";
import Discord from "mdi-material-ui/Discord";
import Skype from "mdi-material-ui/Skype";
import Twitch from "mdi-material-ui/Twitch";
import Email from "@material-ui/icons/Email";
import Facebook from "@material-ui/icons/Facebook";
import Instagram from "@material-ui/icons/Instagram";
import Telegram from "@material-ui/icons/Telegram";
import WhatsApp from "@material-ui/icons/WhatsApp";
import {social as urls} from '@truecost/shared';

export const contact = [
    {
        valid: true,
        icon: <WhatsApp/>,
        title: "WhatsApp",
        url: urls.whatsapp,
    },
    {
        valid: true,
        icon: <Telegram/>,
        title: "Telegram",
        url: urls.telegram,
    },
    {
        valid: true,
        icon: <Facebook/>,
        title: "Facebook",
        url: urls.facebook,
    },
    {
        valid: true,
        icon: <Instagram/>,
        title: "Instagram",
        url: urls.instagram,
    },
    {
        valid: false,
        icon: <Discord/>,
        title: "Discord",
        url: urls.discord,
    },
];

export const social = [
    ...contact,
    {
        valid: true,
        icon: <Email/>,
        title: "Email",
        url: urls.email,
    },
    {
        valid: true,
        icon: <Twitch/>,
        title: "Twitch",
        url: urls.twitch,
    },
    {
        valid: true,
        icon: <Skype/>,
        title: "Skype",
        url: urls.skype,
    },
];
