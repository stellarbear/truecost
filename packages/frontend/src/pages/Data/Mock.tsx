import * as React from 'react';
import {Col} from 'pages/Base/Grid';

interface IProps {
    permanent?: boolean;
}

//http://ajaxloadingimages.net/
export const Mock: React.FC<IProps> = ({permanent}) => {
    const [hydrated, setHydrated] = React.useState(false);

    React.useEffect(() => {
        !hydrated && (permanent == undefined) && setHydrated(true);
    }, []);

    return (
        <div style={{
            transition: "all 0.5s",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: hydrated ? -9000 : 9000,
            opacity: hydrated ? 0.0 : 1.0,
            backgroundColor: "#fff",
        }}>
            <Col align="center" s={16}
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}>
                <img
                    alt="logo icon"
                    style={{marginBottom: -48}}
                    width={128} height={128}
                    src={`/logo-black.png`} />
                <img
                    alt="logo icon"
                    style={{marginBottom: -48}}
                    width={128} height={6}
                    src={`/loading.gif`} />
            </Col>
        </div >
    );
};
