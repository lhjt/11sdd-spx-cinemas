import { AnimationClassNames, css } from "@fluentui/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    createStyles,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import * as React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router";
import { useQuery } from "urql";

export interface IndividualMoviePageProps {}

const movieQuery = `
query getMovie($movieId: String!) {
    getMovie(id: $movieId) {
        id
        name
        classification
        genre
        director
        duration
        plot
        poster
        sessions {
            id
            theatre {
                id
                name
            }
            startTime
            endTime
        }
    }
}
`;

interface MovieData {
    getMovie: {
        classification: string;
        director: string;
        duration: number;
        genre: string[];
        id: string;
        name: string;
        plot: string;
        poster: string;
        sessions: {
            id: string;
            theatre: {
                id: string;
                name: string;
            };
            startTime: Date;
            endTime: Date;
        }[];
    };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        loading: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: theme.spacing(8),
            flexWrap: "nowrap",
        },
        container: {
            display: "flex",
            margin: theme.spacing(4),
        },
        director: {
            // marginTop: "-.5rem",
        },
        infoCard: {
            width: 400,
        },
        trailerButton: {
            fontSize: theme.typography.body1.fontSize,
            width: "100%",
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
    })
);

const IndividualMoviePage: React.SFC<IndividualMoviePageProps> = () => {
    const classes = useStyles();
    const { movieId } = useParams<{ movieId: string }>();

    const [results] = useQuery({
        query: movieQuery,
        variables: { movieId },
    });

    const { fetching, data } = results;

    if (fetching)
        return (
            <div className={css(classes.loading, AnimationClassNames.fadeIn500)}>
                <CircularProgress size="8rem" />
            </div>
        );

    const {
        getMovie: { classification, director, duration, genre, id, name, plot, poster, sessions },
    } = data as MovieData;

    return (
        <>
            <Helmet>
                <title>SPX Cinemas - {name}</title>
            </Helmet>
            <div className={css(classes.container, AnimationClassNames.slideUpIn20)}>
                <Card variant="outlined" className={classes.infoCard}>
                    <CardHeader
                        title={name}
                        subheader={genre
                            .map((g) => g.charAt(0).toUpperCase() + g.slice(1))
                            .join(", ")}
                    />
                    <img style={{ width: "100%" }} src={poster} alt={name + " Poster"} />
                    <CardContent>
                        <Typography color="textSecondary" variant="subtitle1">
                            Directed by {director}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            Runtime: {duration} minutes
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            Classification: {classification}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.trailerButton}
                        >
                            Watch Trailer
                        </Button>
                        <Typography>{plot}</Typography>
                    </CardContent>
                </Card>
                <div></div>
            </div>
        </>
    );
};

export default IndividualMoviePage;
