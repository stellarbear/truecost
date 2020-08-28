import React from 'react';

interface TrustBoxProps {
    size: "small" | "big";
    theme?: "light" | "dark";
}

const TrustBox: React.FC<TrustBoxProps> = ({
                                               size,
                                               theme = "light",
                                           }) => {
    // Create a reference to the <div> element which will represent the TrustBox
    const ref = React.useRef(null);
    React.useEffect(() => {
        // If window.Trustpilot is available it means that we need to load the TrustBox from our ref.
        // If it's not, it means the script you pasted into <head /> isn't loaded  just yet.
        // When it is, it will automatically load the TrustBox.
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
        case "small":
        default:
            [template, height] = ["56278e9abfbbba0bdcd568bc", 40];
            break;
    }

    return (
        <div
            style={{height, width: "100%", padding: 8}}
            ref={ref} // We need a reference to this element to load the TrustBox in the effect.
            className="trustpilot-widget" // Renamed this to className.
            data-locale="en-US"
            data-template-id={template}
            data-businessunit-id="5e4c2b703be4c400018e2b59"
            data-style-height="100%" data-style-width="100%" data-theme={theme}
        >
            <a href="https://www.trustpilot.com/review/truecost.gg" target="_blank" rel="noreferrer">Trustpilot</a>
        </div>
    );
};
export default TrustBox;
