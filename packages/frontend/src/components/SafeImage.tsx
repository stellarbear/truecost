import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {clientUri, serverUri} from 'auxiliary/route';
import {useState} from 'react';
import LazyLoad from 'react-lazyload';

interface IProps extends React.ImgHTMLAttributes<any> {
    src: string
}

export const SafeImage: React.FC<IProps> = ({src, ...rest}) => {
    const {current: {game}} = useStore();
    const fallback = game.id === "truecost" ? `${clientUri}/default/assistant.png`
        : `${serverUri}/${game.id}/${game.assistant}/u.png`;

    const [error, setError] = useState(false);

    const supress = (e: any) => {
        (e.target as any).onerror = null;
        (e.target as any).src = fallback;
    }

    return (
        <LazyLoad>
            <img
                src={error ? fallback : src}
                {...rest}
                onError={error
                    ? supress
                    : () => setError(true)}
            />
        </LazyLoad>
    )

}