import * as React from "react";
import {Discord, Skype, Twitch} from "mdi-material-ui";
import {Email, Facebook, Instagram, Telegram, WhatsApp} from "@material-ui/icons";

const social = [
    {
        valid: true,
        icon: <Email/>,
        title: "Email",
        url: "mailto:truecostgg@gmail.com",
    },
    {
        valid: true,
        icon: <WhatsApp/>,
        title: "WhatsApp",
        url: "https://wa.me/14243174366",
    },
    {
        valid: true,
        icon: <Telegram/>,
        title: "Telegram",
        url: "https://telegram.me/TrueCostGG",
    },
    {
        valid: true,
        icon: <Facebook/>,
        title: "Facebook",
        url: "http://www.facebook.com/true.cost.906",
    },
    {
        valid: true,
        icon: <Instagram/>,
        title: "Instagram",
        url: "https://instagram.com/_u/truecostgg/",
    },
    {
        valid: true,
        icon: <Twitch/>,
        title: "Twitch",
        url: "https://www.twitch.tv/truecost",
    },
    {
        valid: false,
        icon: <Discord/>,
        title: "Discord",
        url: "truecost#3160",
    },
    {
        valid: true,
        icon: <Skype/>,
        title: "Skype",
        url: "https://join.skype.com/invite/cxPHGgunsEyQ",
    },
];

export {social};
