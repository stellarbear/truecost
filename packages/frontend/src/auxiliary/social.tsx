import * as React from "react";
import Discord from "mdi-material-ui/Discord";
import Skype from "mdi-material-ui/Skype";
import Twitch from "mdi-material-ui/Twitch";
import Email from "@material-ui/icons/Email";
import Facebook from "@material-ui/icons/Facebook";
import Instagram from "@material-ui/icons/Instagram";
import Telegram from "@material-ui/icons/Telegram";
import WhatsApp from "@material-ui/icons/WhatsApp";
import * as shared from '@truecost/shared';

export const social = [
    {
        valid: true,
        icon: <Email/>,
        title: "Email",
        url: shared.social.email,
    },
    {
        valid: true,
        icon: <WhatsApp/>,
        title: "WhatsApp",
        url: shared.social.whatsapp,
    },
    {
        valid: true,
        icon: <Telegram/>,
        title: "Telegram",
        url: shared.social.telegram,
    },
    {
        valid: true,
        icon: <Facebook/>,
        title: "Facebook",
        url: shared.social.facebook,
    },
    {
        valid: true,
        icon: <Instagram/>,
        title: "Instagram",
        url: shared.social.instagram,
    },
    {
        valid: true,
        icon: <Twitch/>,
        title: "Twitch",
        url: shared.social.twitch,
    },
    {
        valid: false,
        icon: <Discord/>,
        title: "Discord",
        url: shared.social.discord,
    },
    {
        valid: true,
        icon: <Skype/>,
        title: "Skype",
        url: shared.social.skype,
    },
];