import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {Helmet} from "react-helmet";

interface HeadProps extends RouteComponentProps {
    children: JSX.Element;
}

const HeadWrapper: React.FC<HeadProps> =
    ({children, history}): JSX.Element => {
        const url = history.location.pathname;


        return (
            <React.Fragment>
                <Helmet>
                </Helmet>
                {children}
            </React.Fragment>
        );
    };


export default withRouter(HeadWrapper);
