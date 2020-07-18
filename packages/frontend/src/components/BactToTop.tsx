import React, {useEffect, useState} from "react";
import {Fab} from "@material-ui/core";
import Navigation from "@material-ui/icons/Navigation";

const BackTopTop: React.FC = ({children, }) => {
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const onScroll = () => {
        setShowTopButton(window.scrollY > 0);
    };
    const [showTopButton, setShowTopButton] = useState(false);


    return (
        <React.Fragment>
            {children}
            {showTopButton && (
                <Fab style={{
                    position: "fixed",
                    left: 30, bottom: 20,
                    zIndex: 5,
                    width: 60, height: 60,
                    borderRadius: 30,
                }} variant="extended" color="primary"
                    onClick={() => window.scroll({top: 0, left: 0, behavior: "smooth"})}>
                    <Navigation />
                </Fab>
            )}
        </React.Fragment>
    );
};

export default BackTopTop;
