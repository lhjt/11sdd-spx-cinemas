import { Button, CircularProgress } from "@material-ui/core";
import jwt from "jsonwebtoken";
import queryString from "query-string";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { apiURL } from "../../..";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";

export interface LoginPageProps extends RouteComponentProps<{ continue: string }> {}

export interface LoginPageState {
    confirmingLogin: boolean;
}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    static contextType = AuthenticationContext;
    context!: React.ContextType<typeof AuthenticationContext>;

    constructor(props: LoginPageProps) {
        super(props);
        this.state = { confirmingLogin: true };
    }

    async componentDidMount() {
        if (!this.context.userAccount) {
            try {
                console.log("No userAccount data found, attempting to refresh...");
                const d = await fetch(apiURL("/accounts/refresh"), {
                    method: "POST",
                    credentials: "include",
                });

                if (d.status !== 200) throw new Error("Failed to refresh");

                const data = await d.text();

                console.log(data);

                const continueURL = this.parseLoginDetails(data);

                if (continueURL) return this.props.history.replace(atob(continueURL));
                this.props.history.replace("/");
            } catch (error) {
                console.error(error);
                this.setState({ confirmingLogin: false });
                console.log("Failed to run refresh");
            }
        } else {
            console.log("Logged in already");
        }
    }

    private login = async () => {
        console.log("Attempting to login...");

        try {
            const d = await fetch(apiURL("/accounts/login"), {
                method: "POST",
                body: JSON.stringify({ email: "email@email.com", password: "password" }),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (d.status !== 200) throw new Error("[AUTH] Invalid credentials");
            const data = await d.text();

            const continueURL = this.parseLoginDetails(data);
            if (continueURL) return this.props.history.replace(atob(continueURL));
            this.props.history.replace("/");
        } catch (error) {}
    };
    private parseLoginDetails = (data: string) => {
        const payload = jwt.decode(data) as { uid: string };

        console.log(`[ACCOUNTS] Logged payload received`, payload);

        this.context.setUser(payload.uid, data);

        console.log(`[ACCOUNTS] User set`, this.context.userAccount);

        const continueURL = queryString.parse(this.props.location.search).continue as
            | string
            | undefined;
        return continueURL;
    };

    render() {
        if (this.state.confirmingLogin) return <CircularProgress />;

        return (
            <>
                <Button variant="contained" color="primary" onClick={this.login}>
                    Attempt to login
                </Button>
            </>
        );
    }
}

export default LoginPage;
