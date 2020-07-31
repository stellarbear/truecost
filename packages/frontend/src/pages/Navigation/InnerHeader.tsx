import * as React from 'react';
import {Tabs, Tab} from '@material-ui/core';
import {useHistory, Redirect} from 'react-router';
import {Col} from 'pages/Base/Grid';
import AuthRoute from 'pages/Admin/AuthRoute';

interface IProps {
    prefix: string
    routes: {
        url: string;
        component: React.FC<{}>;
    }[]
    base: string
}

export const InnerHeader: React.FC<IProps> = ({prefix, routes, base}) => {
    const history = useHistory();
    const subRoute = history.location.pathname
    const index = subRoute.lastIndexOf('/');
    const last = subRoute.slice(index + 1);
    const value = !(routes.map(r => r.url).includes(last)) ? "default" : last;

    return (
        <>
            <Col s={16}>
                <Tabs
                    value={last}
                    scrollButtons="auto"
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab value={"default"} style={{display: "none"}} />
                    {
                        routes.map(({url}) =>
                            <Tab value={url} label={url} key={url} onClick={() => {
                                history.push(`/${prefix}/${url}`)
                            }} />
                        )
                    }
                </Tabs>
            </Col>
            {routes.map(({url, component}) =>
                <AuthRoute exact
                    key={url}
                    path={`/${prefix}/${url}`}
                    component={component} />)}
        </>
    )
}