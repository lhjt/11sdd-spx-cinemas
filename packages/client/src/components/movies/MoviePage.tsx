import { createStyles, makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import { CloudOffRounded } from "@material-ui/icons";
import * as React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "urql";
import LoadingMovieCard from "./movie-card/LoadingMovieCard";
import MovieCard from "./movie-card/MovieCard";

export interface MoviePageProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cards: {
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
        },
        errorPaper: {
            width: 500,
            height: 300,
            padding: theme.spacing(2),
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: theme.spacing(4),
        },
        cloud: {
            fontSize: "6rem",
        },
    })
);

const getMoviesQuery = `
    query {
        getMovies {
        name
        genre
        plot
        poster
        id
        }
    }
`;

const MoviePage: React.SFC<MoviePageProps> = () => {
    const classes = useStyles();

    const [result] = useQuery({
        query: getMoviesQuery,
    });

    const { data, fetching, error } = result;
    const movieData: {
        getMovies: { name: string; genre: string[]; plot: string; poster: string; id: string }[];
    } = data;

    const contentToBeDisplayed = fetching ? (
        <>
            <LoadingMovieCard />
            <LoadingMovieCard />
            <LoadingMovieCard />
        </>
    ) : error ? (
        <>
            <Paper className={classes.errorPaper} variant="outlined">
                <CloudOffRounded className={classes.cloud} color="disabled" />
                <Typography variant="h4" align="center" color="textSecondary">
                    The server is currently unavailable
                </Typography>
            </Paper>
        </>
    ) : (
        <>
            {movieData.getMovies.map((m) => (
                <MovieCard {...m} key={m.id} />
            ))}
        </>
    );

    return (
        <>
            <Helmet>
                <title>SPX Cinemas - Movies</title>
                <meta
                    name="description"
                    content="Movies that are currently airing at South Pacific Xtreme Cinemas."
                />
            </Helmet>
            <div className={classes.cards}>{contentToBeDisplayed}</div>
        </>
    );
};

export default MoviePage;
