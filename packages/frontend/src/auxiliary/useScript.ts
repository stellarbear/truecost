import {useEffect} from 'react';

export const useScript = (html: any) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.defer = true;

        script.type = "text/javascript";
        script.innerHTML = html;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [html]);
};