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


const App = () => {
	return (
		<MuiPickersUtilsProvider utils={DayJSUtils}>
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
		</MuiPickersUtilsProvider>
	);
};

export default App;

/*
import * as React from "react";
import {Home, NotFound, Account} from "pages";
import {Route} from "react-router-dom";
import AnimatedSwitch from "components/AnimatedSwitch";
import {HeadWrapper, NotifyWrapper} from "components/wrappers";
import NavigationWrapper from "pages/Navigation";
import AuthRoute from "components/AuthRoute";
import {AdminOption, AdminOrder, AdminCategory, AdminItem, AdminTag, AdminUser} from "pages/Admin";
import DayJSUtils from '@date-io/dayjs';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import Shop from "pages/Shop";
import Checkout from "pages/Checkout/Checkout";
import Item from "pages/Item";
import Confirm from "pages/User/Confirm";
import Reset from "pages/User/Reset";
import Register from "pages/User/Register";
import Login from "pages/User/Login";
import Forget from "pages/User/Forget";
import Policy from "pages/Policy";
import Success from "pages/Success";
import Test from "pages/Test";
import About from "pages/About";
import Blog from "pages/Blog";
import TOS from "pages/TOS";
import TrackOrder from "pages/TrackOrder";
import Contact from "pages/Contact";
import BlogPost from "pages/BlogPost";
import AdminAd from "pages/Admin/Ad";
import AdminPass from "pages/Admin/Pass";
import AdminBlog from "pages/Admin/Blog";
import Discount from "pages/Discount";
import {CartWrapper} from "pages/Base/CartWrapper";
import MockWrapper from "pages/Base/MockWrapper";


const App = (): JSX.Element => {
	return (
		<MuiPickersUtilsProvider utils={DayJSUtils}>
			<HeadWrapper>
				<NotifyWrapper>
					<UserWrapper>
						<MockWrapper>
							<NavigationWrapper>
								<Route exact path={`/`} component={Home} />
								<Route exact path={`/shop`} component={Shop} />
								<Route exact path={`/test`} component={Test} />
								<Route exact path={`/success`} component={Success} />
								<Route exact path={`/track`} component={TrackOrder} />
								<Route exact path={`/blog`} component={Blog} />
								<Route exact path={`/discount`} component={Discount} />
								<Route exact path={`/checkout`} component={Checkout} />
								<Route exact path={`/item/:id`} component={Item} />
								<Route exact path={`/blog/:id`} component={BlogPost} />

								<Route exact path={`/user/forget`} component={Forget} />
								<Route exact path={`/user/reset/:id/:session`} component={Reset} />
								<Route exact path={`/user/confirm/:id/:session`} component={Confirm} />

								<AuthRoute exact path={`/admin/category`} component={AdminCategory} />
								<AuthRoute exact path={`/admin/pass`} component={AdminPass} />
								<AuthRoute exact path={`/admin/user`} component={AdminUser} />
								<AuthRoute exact path={`/admin/blog`} component={AdminBlog} />
								<AuthRoute exact path={`/admin/item`} component={AdminItem} />
								<AuthRoute exact path={`/admin/order`} component={AdminOrder} />
								<AuthRoute exact path={`/admin/option`} component={AdminOption} />
								<AuthRoute exact path={`/admin/ad`} component={AdminAd} />
								<AuthRoute exact path={`/admin/tag`} component={AdminTag} />

								<AuthRoute exact path={`/account`} component={Account} />
								<AuthRoute exact path={`/register`} component={Register} unauthorized />
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
						</MockWrapper>
					</UserWrapper>
				</NotifyWrapper>
			</HeadWrapper>
		</MuiPickersUtilsProvider>
	);
}

export default App;

*/
