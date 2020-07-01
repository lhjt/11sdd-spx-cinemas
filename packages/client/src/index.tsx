import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import { grey, red } from "@material-ui/core/colors";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "typeface-source-sans-pro";
import App from "./App";
import "./index.scss";
import * as serviceWorker from "./serviceWorker";

const muiTheme = createMuiTheme({
    palette: {
        primary: red,
        secondary: grey,
        type: "dark",
    },
    typography: {
        fontFamily: ["Source Sans Pro"].join(","),
    },
});

ReactDOM.render(
    <ThemeProvider theme={muiTheme}>
        <BrowserRouter>
            <React.StrictMode>
                <CssBaseline />
                <App />
            </React.StrictMode>
        </BrowserRouter>
    </ThemeProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
