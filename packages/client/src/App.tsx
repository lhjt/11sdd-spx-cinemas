import {
    AppBar,
    Avatar,
    Badge,
    Button,
    createStyles,
    Dialog,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    Theme,
    Toolbar,
    Tooltip,
    Typography,
    Zoom,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { AccountCircleRounded, ExitToAppRounded, ShoppingCartRounded } from "@material-ui/icons";
import jwt from "jsonwebtoken";
import queryString from "query-string";
import * as React from "react";
import { Route, Switch, useHistory, useLocation, withRouter } from "react-router-dom";
import { apiURL } from ".";
import LoginPage from "./components/authentication/login/LoginPage";
import Homepage from "./components/homepage/Homepage";
import IndividualMoviePage from "./components/movies/IndividualMoviePage";
import MoviePage from "./components/movies/MoviesPage";
import SessionPage from "./components/sessions/SessionPage";
import { AuthenticationContext } from "./contexts/AuthenticationContext";
import ProtectedRoute from "./contexts/ProtectedRoute";
import { HexString } from "./utils/hexEncode";

export interface AppProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        button: {
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1),
            fontSize: theme.typography.h6.fontSize,
            textTransform: "none",
        },
        titleButton: {
            marginRight: theme.spacing(1),
            fontSize: theme.typography.h6.fontSize,
            textTransform: "none",
        },
        avatarIcon: {
            color: red[100],
            backgroundColor: red[500],
        },
    })
);

const App: React.SFC<AppProps> = () => {
    const { clearUser, setUser, userAccount } = React.useContext(AuthenticationContext);

    const [accountDialogIsOpen, setAccountDialogOpenState] = React.useState(false);

    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    React.useEffect(() => {
        (async () => {
            if (!userAccount) {
                try {
                    console.log("No userAccount data found, attempting to refresh...");
                    const d = await fetch(apiURL("/accounts/refresh"), {
                        method: "POST",
                        credentials: "include",
                    });

                    if (d.status !== 200) throw new Error("Failed to refresh");

                    const data = await d.text();

                    console.log(data);

                    const payload = jwt.decode(data) as { uid: string };

                    console.log(payload);

                    setUser(payload.uid, data);

                    const continueURL = queryString.parse(location.search).continue as
                        | string
                        | undefined;

                    if (continueURL) return history.replace(HexString.decode(continueURL));
                } catch (error) {
                    console.log("Not previously logged in correctly");
                }
            } else {
                console.log("Logged in already");
            }
        })();
    }, []);

    return (
        <>
            <AppBar position="sticky" color="secondary">
                <Toolbar>
                    <Button className={classes.titleButton} onClick={() => history.push("/")}>
                        SPX Cinemas
                    </Button>
                    <Button
                        className={classes.titleButton}
                        onClick={() => history.push("/account")}
                    >
                        Account
                    </Button>
                    <Button
                        // startIcon={<MovieRounded />}
                        className={classes.button}
                        onClick={() => history.push("/movies")}
                    >
                        Movies
                    </Button>
                    <div className={classes.grow} />
                    <IconButton>
                        <Tooltip TransitionComponent={Zoom} title="3 Tickets in Cart">
                            <Badge color="primary" badgeContent={3}>
                                <ShoppingCartRounded />
                            </Badge>
                        </Tooltip>
                    </IconButton>
                    <IconButton
                        color="inherit"
                        onClick={() =>
                            userAccount
                                ? setAccountDialogOpenState(true)
                                : history.push(
                                      `/login?continue=${HexString.create(
                                          history.location.pathname
                                      )}`
                                  )
                        }
                    >
                        <Tooltip
                            TransitionComponent={Zoom}
                            title={userAccount ? "Logged In" : "Login"}
                        >
                            <AccountCircleRounded />
                        </Tooltip>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Switch>
                <Route path="/login" component={LoginPage} />
                <ProtectedRoute
                    path="/account"
                    render={(props) => <Typography>You have reached the account page</Typography>}
                />
                <Route path="/sessions/:sessionId" render={(props) => <SessionPage {...props} />} />
                <Route
                    path="/movies/:movieId"
                    render={(props) => <IndividualMoviePage {...props} />}
                />
                <Route path="/movies" render={(props) => <MoviePage {...props} />} />

                <Route path="/" render={(props) => <Homepage {...props} />} />
            </Switch>
            <Dialog open={accountDialogIsOpen} onClose={() => setAccountDialogOpenState(false)}>
                <List>
                    <ListItem
                        button
                        onClick={() => {
                            history.push("/account");
                            setAccountDialogOpenState(false);
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar className={classes.avatarIcon}>
                                <AccountCircleRounded />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>Account</ListItemText>
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => {
                            clearUser();
                            history.push("/");
                            setAccountDialogOpenState(false);
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar className={classes.avatarIcon}>
                                <ExitToAppRounded />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>Logout</ListItemText>
                    </ListItem>
                </List>
            </Dialog>
        </>
    );
};

export default withRouter(App);
