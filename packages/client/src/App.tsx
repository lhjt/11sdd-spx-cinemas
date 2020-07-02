import {
    AppBar,
    Badge,
    Button,
    createStyles,
    IconButton,
    makeStyles,
    Theme,
    Toolbar,
    Tooltip,
    Zoom,
} from "@material-ui/core";
import { AccountCircleRounded, ShoppingCartRounded } from "@material-ui/icons";
import * as React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Homepage from "./components/homepage/Homepage";
import MoviePage from "./components/movies/MoviePage";

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
    })
);

const App: React.SFC<AppProps> = () => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <>
            <AppBar position="sticky" color="secondary">
                <Toolbar>
                    <Button className={classes.titleButton} onClick={() => history.push("/")}>
                        SPX Cinemas
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
                    <IconButton color="inherit">
                        <Tooltip TransitionComponent={Zoom} title="Account">
                            <AccountCircleRounded />
                        </Tooltip>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Switch>
                <Route path="/movies" render={(props) => <MoviePage {...props} />} />
                <Route path="/" render={(props) => <Homepage {...props} />} />
            </Switch>
        </>
    );
};

export default App;
