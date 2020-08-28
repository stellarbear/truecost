import {useEffect} from 'react';

export const useScript = (html: any) => {
    useEffect(() => {
        const script = document.createElement('script');

        script.type = "text/javascript";
        script.innerHTML = html;
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [html]);
};