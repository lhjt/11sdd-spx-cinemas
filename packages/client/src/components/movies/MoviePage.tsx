import { createStyles, makeStyles, Theme } from "@material-ui/core";
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

    const { data, fetching } = result;
    const movieData: {
        getMovies: { name: string; genre: string[]; plot: string; poster: string; id: string }[];
    } = data;

    const contentToBeDisplayed = fetching ? (
        <>
            <LoadingMovieCard />
            <LoadingMovieCard />
            <LoadingMovieCard />
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
