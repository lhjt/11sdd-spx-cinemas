import * as React from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";
import { HexString } from "../utils/hexEncode";
import { AuthenticationContext } from "./AuthenticationContext";

export interface ProtectedRouteProps extends RouteProps {}

const ProtectedRoute: React.SFC<ProtectedRouteProps> = (props) => {
    const { userAccount } = React.useContext(AuthenticationContext);
    const location = useLocation();

    return (
        <Route
            render={() =>
                userAccount ? (
                    <Route {...props} />
                ) : (
                    <Redirect to={`/login?continue=${HexString.create(location.pathname)}`} />
                )
            }
        />
    );
};

export default ProtectedRoute;
