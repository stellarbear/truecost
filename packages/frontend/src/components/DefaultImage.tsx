import React, {ImgHTMLAttributes, useState} from "react";
import {baseGame} from "auxiliary/route";

//import LazyLoad from "react-lazyload";

interface DefaultImageProps extends ImgHTMLAttributes<{}> {
    fallback?: string;
}

const DefaultImage: React.FC<DefaultImageProps> = ({
                                                       fallback = `${baseGame}/pass.png`,
                                                       src, srcSet,
                                                       ...rest
                                                   }) => {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <img
                src={src}
                {...rest}
                onError={(e) => {
                    (e.target as any).onerror = null;
                    (e.target as any).src = fallback;
                }}
            />
        );
    }

    return (
        <React.Fragment>
            <picture style={{...rest.style}}>
                <source
                    {...rest}
                    srcSet={srcSet?.split('\n')
                        .map(s => s.slice(0, s.lastIndexOf(' ')) + '.webp ' + s.slice(s.lastIndexOf(' ') + 1)).join('\n')}
                    type="image/webp"
                />
                <img
                    src={src}
                    {...rest}
                    onError={(e) => setError(true)}
                />
            </picture>
        </React.Fragment>
    );
};

export default DefaultImage;
