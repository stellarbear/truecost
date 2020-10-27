import * as React from "react";
import {Paper} from "@material-ui/core";
import {useLocation} from "react-router-dom";
import {FooterAbout} from "./FooterAbout";
import {FooterAdditionalPayment} from "./FooterAdditionalPayment";
import {FooterPayment} from "./FooterPayment";

export const Footer: React.FC = () => {
    const location = useLocation();

    return (
        <Paper elevation={6} style={{
            margin: "16px 0px",
            zIndex: 3,
            color: "#fff",
            backgroundColor: "#263238",
        }}>
            {!location.pathname.includes("checkout") && <FooterAbout />}
            <FooterAdditionalPayment />
            <FooterPayment />
        </Paper>
    );
};