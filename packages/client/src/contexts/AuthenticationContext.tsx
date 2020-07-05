import * as React from "react";
import { apiURL } from "..";

export interface AuthenticationContextProps {}

interface UserAccount {
    uid: string;
    jwt: string;
}

export interface AuthenticationContextState {
    userAccount?: UserAccount;
}

interface AuthContxt {
    userAccount?: UserAccount;
    setUser: (uid: string, jwt: string) => void;
    clearUser: () => void;
}

export const AuthenticationContext = React.createContext<AuthContxt>({
    setUser: (_: string, __: string) => {},
    clearUser: () => {},
});

class AuthenticationContextProvider extends React.Component<
    AuthenticationContextProps,
    AuthenticationContextState
> {
    constructor(props: AuthenticationContextProps) {
        super(props);
        this.state = {};
    }

    public setUser = (uid: string, jwt: string) => {
        this.setState({ userAccount: { uid, jwt } });
    };

    public clearUser = () => {
        fetch(apiURL("/accounts/logout"), { method: "POST", credentials: "include" });
        this.setState({ userAccount: undefined });
    };

    render() {
        return (
            <AuthenticationContext.Provider
                value={{ ...this.state, setUser: this.setUser, clearUser: this.clearUser }}
            >
                {this.props.children}
            </AuthenticationContext.Provider>
        );
    }
}

export default AuthenticationContextProvider;
