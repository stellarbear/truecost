import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {useState} from 'react';
import LazyLoad from 'react-lazyload';
import {frontend, backend} from 'auxiliary/route';
import {Skeleton} from '@material-ui/lab';

interface IProps extends React.ImgHTMLAttributes<any> {
    src: string
    height?: number
}

export const SafeImage: React.FC<IProps> = ({src, style, height, ...rest}) => {
    const {current: {game}} = useStore();
    const fallback = game.id === "truecost" ? `${frontend.uri}/default/assistant.png`
        : `${backend.uri}/${game.id}/${game.assistant}/u.png`;

    const [error, setError] = useState(false);

    const supress = (e: any) => {
        (e.target as any).onerror = null;
        (e.target as any).src = fallback;
    }

    return (
        <LazyLoad
            height={height}
            once debounce
            placeholder={<Skeleton variant="rect" width={"100%"} height={height} />}
        >
            <img
                src={error ? fallback : src}
                style={{
                    display: "block",
                    ...style,
                }}
                {...rest}
                onError={error
                    ? supress
                    : () => setError(true)}
            />
        </LazyLoad>
    )

}