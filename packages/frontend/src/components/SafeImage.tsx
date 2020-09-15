import * as React from 'react';
import {useState} from 'react';
import {useStore} from 'pages/Data/Wrapper';
import LazyLoad from 'react-lazyload';
import {backend, frontend} from 'auxiliary/route';
import Skeleton from '@material-ui/lab/Skeleton';

interface IProps extends React.ImgHTMLAttributes<any> {
    src: string;
    height?: string | number;
}

export const SafeImage: React.FC<IProps> = ({src, style = {}, height, ...rest}) => {
    const {current: {game}} = useStore();
    const fallback = game.id === "truecost" ? `${frontend.uri}/default/assistant.png`
        : `${backend.uri}/${game.id}/${game.assistant}/u.png`;

    const [error, setError] = useState(0);

    const supress = (e: any) => (e.target as any).onerror = null;

    const baseStyle = {
        display: "block",
        maxWidth: "100%",
        margin: "0 auto",
        height: height,
        ...style,
    };

    const baseSrc = src.slice(0, src.lastIndexOf('.'));

    return (
        <LazyLoad
            height={height}
            once debounce={100}
            placeholder={<Skeleton variant="rect" width={"100%"} height={height} />}
        >
            <picture>
                {error == 0 && (
                    <source
                        srcSet={`${baseSrc}.webp`}
                        type="image/webp"
                        onError={supress}
                    />
                )}
                <img
                    height={height}
                    src={error > 1 ? fallback : src}
                    style={baseStyle}
                    {...rest}
                    onError={() => setError(1 + error)}
                />
            </picture>
        </LazyLoad>
    );

};
