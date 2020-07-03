import React, {useContext} from 'react';
import {CartContext} from './CartWrapper';

interface MockWrapperProps {
}

const MockWrapper: React.FC<MockWrapperProps> = ({
                                                     children,
                                                 }) => {
    const {ready: cartReady} = useContext(CartContext);
    //const { ready: userReady } = useContext(UserContext);
    const ready = cartReady /*&& userReady*/;

    const renderMock = () => {
        return (
            <div style={{
                transition: "all 0.5s",
                opacity: ready ? 0.0 : 1.0,
                backgroundColor: "#fff",
                position: "absolute",
                height: "100vh",
                width: "100vw",
                zIndex: ready ? -100 : 100,
            }}>
                <img
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                    width={256} height={256} className="blink-loader"
                    src={`/logo-black.png`}/>
            </div>
        );
    };

    if (!ready) {
        return renderMock();
    }

    return (
        <React.Fragment>
            {renderMock()}
            {children}
        </React.Fragment>
    );
};

export default MockWrapper;
