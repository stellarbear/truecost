import {useEffect, useState} from "react";

export const useScrollToTop = () => {
    useEffect(() => {
        debugger;
        window.scroll({top: 0, left: 0, behavior: 'smooth'})
    }, [])
}
