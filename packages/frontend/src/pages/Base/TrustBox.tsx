import {ButtonBase} from '@material-ui/core';
import React from 'react';

interface TrustBoxProps {
    size: "small" | "big" | "mikro";
    theme?: "light" | "dark";
}

const url = "https://www.trustpilot.com/review/truecost.gg?stars=5";

export const TrustBox: React.FC<TrustBoxProps> = (props) => {
    const {
        size,
        theme = "light",
    } = props;

    const ref = React.useRef(null);

    React.useEffect(() => {
        if ((window as any).Trustpilot) {
            (window as any).Trustpilot.loadFromElement(ref.current, true);
        }
    }, []);

    let height: number | string | undefined = 0;
    let template = "";
    switch (size) {
        case "big":
            [template, height] = ["5613c9cde69ddc09340c6beb", undefined];
            break;
        case "mikro":
            [template, height] = ["5419b6a8b0d04a076446a9ad", 24];
            break;
        case "small":
        default:
            [template, height] = ["56278e9abfbbba0bdcd568bc", 40];
            break;
    }

    return (
        <a target="_blank" rel="noreferrer"
            style={{width: "100%", height: "100%"}}
            href={url}>
            <ButtonBase
                style={{width: "100%", height: "100%", padding: 16}}>
                <div
                    style={{height, width: "auto", pointerEvents: "none"}}
                    ref={ref}
                    className="trustpilot-widget"
                    data-locale="en-US"
                    data-template-id={template}
                    data-businessunit-id="5e4c2b703be4c400018e2b59"
                    data-style-height="100%" data-style-width="100%" data-theme={theme}
                />
            </ButtonBase>
        </a>
    );
};