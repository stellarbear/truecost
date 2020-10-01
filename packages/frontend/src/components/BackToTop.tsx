import React, {useEffect, useState} from "react";
import {Fab} from "@material-ui/core";
import Navigation from "@material-ui/icons/Navigation";

export const BackToTop: React.FC = ({children}) => {
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const onScroll = () => {
        setShowTopButton(window.scrollY > 180);
    };
    const [showTopButton, setShowTopButton] = useState(false);


    return (
        <>
            {children}
            <Fab
                aria-label="scroll to top"
                style={{
                    pointerEvents: showTopButton ? "all" : "none",
                    opacity: showTopButton ? 1 : 0,
                    transition: "all 0.5s",
                    position: "fixed",
                    left: 30, bottom: 20,
                    zIndex: 5,
                    width: 60, height: 60,
                    borderRadius: 30,
                }} variant="extended" color="primary"
                onClick={() => window.scroll({top: 0, left: 0, behavior: "smooth"})}>
                <Navigation />
            </Fab>
        </>
    );
};
