import * as React from "react";
import Discord from "mdi-material-ui/Discord";
import Skype from "mdi-material-ui/Skype";
import Twitch from "mdi-material-ui/Twitch";
import Email from "@material-ui/icons/Email";
import Facebook from "@material-ui/icons/Facebook";
import Instagram from "@material-ui/icons/Instagram";
import Telegram from "@material-ui/icons/Telegram";
import WhatsApp from "@material-ui/icons/WhatsApp";

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
        url: "https://www.facebook.com/SupportTrueCost",
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
        url: "truecostgg#3160",
    },
    {
        valid: true,
        icon: <Skype/>,
        title: "Skype",
        url: "https://join.skype.com/invite/cxPHGgunsEyQ",
    },
];

export {social};
