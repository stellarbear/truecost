import * as React from 'react';
import {Tab, Tabs} from '@material-ui/core';
import {useHistory} from 'react-router';
import {Row} from 'pages/Base/Grid';
import AuthRoute from 'pages/Admin/AuthRoute';

interface IProps {
    wrap?: boolean;
    prefix: string;
    routes: {
        url: string;
        component: React.FC;
    }[];
}

export const InnerHeader: React.FC<IProps> = ({prefix, routes, wrap = false}) => {
    const history = useHistory();
    const subRoute = history.location.pathname;
    const index = subRoute.lastIndexOf('/');
    const last = subRoute.slice(index + 1);
    const value = !(routes.map(r => r.url).includes(last)) ? "default" : last;

    const renderRoutes = () => [
        <Tab value={"default"} style={{display: "none"}} key={0}/>,
        ...routes.map(({url}) =>
            <Tab value={url} label={url} key={url} onClick={() => {
                history.push(`/${prefix}/${url}`);
            }} />,
        ),
    ];

    const renderHeader = () => (
        !wrap ?
            (
                <Tabs
                    value={value}
                    variant={"fullWidth"}
                    centered={true}
                    scrollButtons="auto"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {renderRoutes()}
                </Tabs>
            ) : (
                renderRoutes()
            )
    );

    return (
        <>
            <Row wrap m={16}
                justify="center"
            >
                {renderHeader()}
            </Row>
            {routes.map(({url, component}) =>
                <AuthRoute exact
                    key={url}
                    path={`/${prefix}/${url}`}
                    component={component} />)}
        </>
    );
};
