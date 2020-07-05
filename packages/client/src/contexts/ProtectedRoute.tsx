import * as React from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";
import { AuthenticationContext } from "./AuthenticationContext";

export interface ProtectedRouteProps extends RouteProps {}

const ProtectedRoute: React.SFC<ProtectedRouteProps> = (props) => {
    const { userAccount } = React.useContext(AuthenticationContext);
    const location = useLocation();

    if (!userAccount) {
        const renderComponent = () => (
            <Redirect to={{ pathname: `/login?continue=${btoa(location.pathname)}}` }} />
        );
        return <Route {...props} component={renderComponent} render={undefined} />;
    } else {
        return <Route {...props} />;
    }
};

export default ProtectedRoute;
