import * as React from 'react';
import {createContext, useState, useEffect} from 'react';
import {Backdrop, CircularProgress} from '@material-ui/core';

export interface IContext {
    setLoading: (input: boolean) => void
}

const LoadingContext = createContext({} as IContext);

const LoadingWrapper: React.FC = ({children}) => {
    const [loading, setLoading] = React.useState(false);

    return (
        <LoadingContext.Provider value={{
            setLoading
        }}>
            <>
                {children}
                <Backdrop style={{zIndex: 999}} open={loading}>
                    <CircularProgress
                        disableShrink color="inherit" />
                </Backdrop>
            </>
        </LoadingContext.Provider>
    );
};

export {LoadingWrapper, LoadingContext};

export const useLoading = () => React.useContext(LoadingContext)