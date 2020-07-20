import * as React from "react";
import {Home, NotFound} from "pages";
import {Route} from "react-router-dom";
import {NotifyWrapper} from "components/wrappers";
import NavigationWrapper from "pages/Navigation";
import AuthRoute from "pages/Admin/AuthRoute";
import DayJSUtils from '@date-io/dayjs';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import Policy from "pages/Policy";
import About from "pages/About";
import TOS from "pages/TOS";
import Contact from "pages/Contact";
import {DataContext, DataWrapper} from "pages/Data/Wrapper";
import {admin} from "pages/Admin/routes";
import Shop from "pages/Shop/Shop";
import {Login} from "pages/User";
import {Item} from "pages/Item/Item";
import {LoadingWrapper} from "components/wrappers/LoadingWrapper";


const App = () => {
	return (
		<LoadingWrapper>
			<NotifyWrapper>
				<DataWrapper>
					<DataContext.Consumer>
						{({store: {game}}) => {
							const urls = Object.values(game.data.id).map(value => value.url);

							return (
								<NavigationWrapper>
									<Route exact path={urls.map(u => '/' + u)} component={Home} />
									<Route exact path={urls.map(u => '/' + u + '/shop')} component={Shop} />
									<Route exact path={urls.map(u => '/' + u + '/item/:url')} component={Item} />

									{
										admin.routes.map(({url, component}) =>
											<AuthRoute exact
												key={url}
												path={`/admin/${url}`}
												component={component} />)
									}

									<AuthRoute exact path={`/login`} component={Login} unauthorized />

									<Route exact path={`/contact`} component={Contact} />
									<Route exact path={`/policy`} component={Policy} />
									<Route exact path={`/about`} component={About} />
									<Route exact path={`/tos`} component={TOS} />
									<Route
										render={({staticContext}) => {
											if (staticContext) {
												staticContext.statusCode = 404;
											}
											return <NotFound />;
										}}
									/>
								</NavigationWrapper>
							);
						}}
					</DataContext.Consumer>
				</DataWrapper>
			</NotifyWrapper>
		</LoadingWrapper>
	);
};

export default App;
