import * as React from 'react';
import {Tabs, Tab} from '@material-ui/core';
import {useHistory, Redirect} from 'react-router';
import {admin} from './routes';
import {Col} from 'pages/Base/Grid';

export const Header = () => {
    const history = useHistory();
    const subRoute = history.location.pathname
    const index = subRoute.lastIndexOf('/');
    const last = subRoute.slice(index + 1);
    const value = !(admin.routes.map(r => r.url).includes(last)) ? "default" : last;
    /*
        debugger;
    
        if (!(admin.routes.map(r => r.url).includes(last))) {
            return <Redirect to={`/admin/${admin.routes[0].url}`}/>
        }
    */
    return (
        <Col s={16}>
            <Tabs
                value={value}
                scrollButtons="auto"
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab value={"default"} style={{display: "none"}}/>
                {
                    admin.routes.map(({url}) =>
                        <Tab value={url} label={url} key={url} onClick={() => {
                            history.push(`/admin/${url}`)

                        }} />
                    )
                }
            </Tabs>
        </Col>
    )
}
