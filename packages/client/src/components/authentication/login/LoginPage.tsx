import { AnimationClassNames, css } from "@fluentui/react";
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Snackbar,
    TextField,
    Theme,
    Typography,
    withStyles,
    WithStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import jwt from "jsonwebtoken";
import queryString from "query-string";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { apiURL } from "../../..";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import { HexString } from "../../../utils/hexEncode";

// eslint-disable-next-line no-control-regex
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export interface LoginPageState {
    loadingRefresh: boolean;
    emailValue: string;
    passwordValue: string;
    loggingIn: boolean;
    invalidCredentials: boolean;
    registerOpen: boolean;
    firstNameValue: string;
    lastNameValue: string;
    emailAlreadyExists: boolean;
}

const styles = (theme: Theme) =>
    createStyles({
        root: {
            height: "100vh",
            width: "100vw",
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        card: {
            height: 400,
            width: 300,
        },
        cardContent: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
        },
        emailInput: {
            marginBottom: theme.spacing(2),
        },
        registerLink: {
            textAlign: "center",
            cursor: "pointer",
            marginTop: "-1rem",
        },
    });

const createUserMutation = `
mutation createUser($data: CreateUserArgs!) {
    createUser(userDetails:$data) {
        id
    }
}
`;

export interface LoginPageProps
    extends RouteComponentProps<{ continue: string }>,
        WithStyles<typeof styles> {}

const LoginPage = withStyles(styles)(
    class LoginPageClass extends React.Component<LoginPageProps, LoginPageState> {
        static contextType = AuthenticationContext;
        context!: React.ContextType<typeof AuthenticationContext>;

        constructor(props: LoginPageProps) {
            super(props);
            this.state = {
                loadingRefresh: true,
                emailValue: "",
                passwordValue: "",
                loggingIn: false,
                invalidCredentials: false,
                registerOpen: false,
                firstNameValue: "",
                lastNameValue: "",
                emailAlreadyExists: false,
            };
        }

        async componentDidMount() {
            console.log("Authentication check proceeding...", this.props.location.search);
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
                    if (continueURL)
                        return this.props.history.replace(HexString.decode(continueURL));
                    this.props.history.replace("/");
                } catch (error) {
                    console.error(error);
                    this.setState({ loadingRefresh: false });
                    console.log("Failed to run refresh");
                }
            } else {
                console.log("Logged in already");
            }
        }

        private register = async () => {
            this.setState({ loggingIn: true });
            console.log(apiURL.toString());
            const result = await fetch(apiURL("/graph"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: createUserMutation,
                    variables: {
                        data: {
                            firstName: this.state.firstNameValue,
                            lastName: this.state.lastNameValue,
                            email: this.state.emailValue,
                            password: this.state.passwordValue,
                        },
                    },
                    operationName: "createUser",
                }),
            });

            const data = await result.json();
            if (data.errors?.length > 0) {
                setTimeout(() => {
                    this.setState({ emailAlreadyExists: false });
                }, 5000);
                this.setState({ loggingIn: false });
                return this.setState({ emailAlreadyExists: true });
            }

            this.setState({ loggingIn: false });
            return this.login();
        };

        private login = async () => {
            console.log("Attempting to login...");
            this.setState({ loggingIn: true, invalidCredentials: false });

            try {
                const d = await fetch(apiURL("/accounts/login"), {
                    method: "POST",
                    body: JSON.stringify({
                        email: this.state.emailValue,
                        password: this.state.passwordValue,
                    }),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (d.status === 404) {
                    this.setState({ invalidCredentials: true, loggingIn: false });
                }

                if (d.status !== 200) throw new Error("[AUTH] Invalid credentials");
                const data = await d.text();

                const continueURL = this.parseLoginDetails(data);
                if (continueURL) return this.props.history.replace(HexString.decode(continueURL));
                this.props.history.replace("/");
            } catch (error) {}
        };

        private handleSubmit = () => {
            if (this.canSubmit()) return;

            console.log(this.state);
            this.login();
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

        private isValidEmail = () => {
            return this.state.emailValue === "" || emailRegex.test(this.state.emailValue);
        };

        private canSubmit = () => {
            return (
                this.state.emailValue.length === 0 ||
                this.state.passwordValue.length === 0 ||
                !this.isValidEmail() ||
                this.state.loggingIn ||
                this.state.invalidCredentials
            );
        };

        render() {
            const { classes } = this.props;

            if (this.state.loadingRefresh)
                return (
                    <div className={classes.root}>
                        <CircularProgress />
                    </div>
                );

            return (
                <div className={classes.root}>
                    <Card
                        variant="outlined"
                        className={css(classes.card, AnimationClassNames.slideUpIn20)}
                    >
                        <LinearProgress
                            variant={this.state.loggingIn ? "indeterminate" : "determinate"}
                            value={this.state.loggingIn ? undefined : 0}
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography variant="h4" align="center">
                                Login
                            </Typography>
                            <form>
                                <TextField
                                    className={classes.emailInput}
                                    variant="filled"
                                    label="Email"
                                    fullWidth
                                    type="email"
                                    value={this.state.emailValue}
                                    error={!this.isValidEmail()}
                                    helperText={!this.isValidEmail() ? "Invalid Email" : undefined}
                                    onChange={(v) =>
                                        this.setState({
                                            emailValue: v.currentTarget.value,
                                            invalidCredentials: false,
                                        })
                                    }
                                    onKeyDown={(k) => {
                                        if (k.key === "Enter") this.handleSubmit();
                                    }}
                                    autoComplete="email"
                                />
                                <TextField
                                    variant="filled"
                                    label="Password"
                                    fullWidth
                                    type="password"
                                    value={this.state.passwordValue}
                                    onChange={(v) =>
                                        this.setState({
                                            passwordValue: v.currentTarget.value,
                                            invalidCredentials: false,
                                        })
                                    }
                                    onKeyDown={(k) => {
                                        if (k.key === "Enter") this.handleSubmit();
                                    }}
                                    autoComplete="current-password"
                                />
                            </form>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={this.canSubmit()}
                                onClick={this.handleSubmit}
                            >
                                {this.state.loggingIn ? "One sec..." : "Login"}
                            </Button>
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => this.setState({ registerOpen: true })}
                                className={classes.registerLink}
                                style={{ display: this.state.loggingIn ? "none" : "inline" }}
                            >
                                Register
                            </Button>
                        </CardContent>
                    </Card>
                    <Snackbar open={this.state.invalidCredentials} autoHideDuration={3000}>
                        <Alert severity="error">
                            Invalid credentials. Did you mean to register?
                        </Alert>
                    </Snackbar>
                    <Snackbar open={this.state.emailAlreadyExists}>
                        <Alert severity="error">
                            The email you are trying to register has already been registered.
                        </Alert>
                    </Snackbar>
                    <Dialog
                        maxWidth="xs"
                        open={this.state.registerOpen}
                        onClose={() => this.setState({ registerOpen: false })}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">Register</DialogTitle>
                        <DialogContent>
                            <TextField
                                className={classes.emailInput}
                                variant="filled"
                                label="First Name"
                                fullWidth
                                type="text"
                                value={this.state.firstNameValue}
                                onChange={(v) =>
                                    this.setState({
                                        firstNameValue: v.currentTarget.value,
                                        invalidCredentials: false,
                                    })
                                }
                                onKeyDown={(k) => {
                                    if (k.key === "Enter") this.register();
                                }}
                                autoComplete="last-name"
                            />
                            <TextField
                                className={classes.emailInput}
                                variant="filled"
                                label="Last Name"
                                fullWidth
                                type="text"
                                value={this.state.lastNameValue}
                                onChange={(v) =>
                                    this.setState({
                                        lastNameValue: v.currentTarget.value,
                                        invalidCredentials: false,
                                    })
                                }
                                onKeyDown={(k) => {
                                    if (k.key === "Enter") this.register();
                                }}
                                autoComplete="last-name"
                            />
                            <TextField
                                className={classes.emailInput}
                                variant="filled"
                                label="Email"
                                fullWidth
                                type="email"
                                value={this.state.emailValue}
                                error={!this.isValidEmail()}
                                helperText={!this.isValidEmail() ? "Invalid Email" : undefined}
                                onChange={(v) =>
                                    this.setState({
                                        emailValue: v.currentTarget.value,
                                        invalidCredentials: false,
                                    })
                                }
                                onKeyDown={(k) => {
                                    if (k.key === "Enter") this.register();
                                }}
                                autoComplete="email"
                            />
                            <TextField
                                variant="filled"
                                label="Password"
                                fullWidth
                                type="password"
                                value={this.state.passwordValue}
                                onChange={(v) =>
                                    this.setState({
                                        passwordValue: v.currentTarget.value,
                                        invalidCredentials: false,
                                    })
                                }
                                onKeyDown={(k) => {
                                    if (k.key === "Enter") this.register();
                                }}
                                autoComplete="current-password"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                disabled={
                                    !(
                                        !this.canSubmit() &&
                                        this.state.firstNameValue.length !== 0 &&
                                        this.state.lastNameValue.length !== 0
                                    ) || this.state.loggingIn
                                }
                                onClick={this.register}
                                color="primary"
                            >
                                Register
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }
    }
);

export default withRouter(LoginPage);
