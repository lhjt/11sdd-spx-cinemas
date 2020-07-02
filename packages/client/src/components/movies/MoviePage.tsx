import { createStyles, makeStyles, Theme } from "@material-ui/core";
import * as React from "react";
import { Helmet } from "react-helmet";
import MovieCard from "./movie-card/MovieCard";

export interface MoviePageProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cards: {
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
        },
    })
);

const MoviePage: React.SFC<MoviePageProps> = () => {
    const classes = useStyles();
    return (
        <>
            <Helmet>
                <title>SPX Cinemas - Movies</title>
                <meta
                    name="description"
                    content="Movies that are currently airing at South Pacific Xtreme Cinemas."
                />
            </Helmet>
            <div className={classes.cards}>
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
            </div>
        </>
    );
};

export default MoviePage;
