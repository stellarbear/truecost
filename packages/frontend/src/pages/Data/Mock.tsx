import {Col} from 'pages/Base/Grid';
import * as React from 'react';

interface IProps {
    permanent?: boolean;
}

//https://loading.io/css/
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
            <Col  align="center"
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
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </Col>
        </div>
    );
};
