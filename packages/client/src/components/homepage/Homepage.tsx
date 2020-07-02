import { createStyles, Fade, makeStyles, Theme, Typography } from "@material-ui/core";
import * as React from "react";
import { Helmet } from "react-helmet";
import backgroundImage from "./cinema-backdrop.jpg";

export interface HomepageProps {}

const styles = makeStyles((theme: Theme) =>
    createStyles({
        rootContainer: {
            height: "100vh",
            width: "100vw",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            position: "absolute",
            top: 0,
            left: 0,
        },
        hero: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        },
    })
);

const Homepage: React.SFC<HomepageProps> = () => {
    const classes = styles();

    return (
        <>
            <Helmet>
                <title>South Pacific Xtreme Cinemas</title>
                <meta
                    name="description"
                    content="South Pacific Xtreme Cinemas - the superior viewing experience."
                />
            </Helmet>
            <div className={classes.rootContainer}>
                <div className={classes.hero}>
                    <Fade appear in>
                        <Typography align="center" variant="h1">
                            Welcome to South Pacific Xtreme Cinemas
                        </Typography>
                    </Fade>
                </div>
            </div>
        </>
    );
};

export default Homepage;
