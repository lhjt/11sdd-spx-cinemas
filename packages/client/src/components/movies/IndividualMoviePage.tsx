import { AnimationClassNames, css } from "@fluentui/react";
import {
    AppBar,
    Button,
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Dialog,
    IconButton,
    makeStyles,
    Theme,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { CloseRounded } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import * as React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router";
import YouTube from "react-youtube";
import { useQuery } from "urql";
import ScrollToTop from "../../utils/ScrollToTop";
import SessionsOverviewCard from "./movie-card/SessionsOverviewCard";
import SkeletonSessionsOverviewCard from "./movie-card/SkeletonSessionsOverviewCard";
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
        trailerURL
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
        trailerURL: string;
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
            minWidth: 400,
            marginRight: theme.spacing(2),
        },
        trailerButton: {
            fontSize: theme.typography.body1.fontSize,
            width: "100%",
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        titleSkeleton: {
            margin: theme.spacing(2),
            borderRadius: 5,
        },
        skeletonButton: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            borderRadius: 5,
        },
        doesNotExist: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        doesNotExistCard: {
            margin: theme.spacing(4),
            padding: theme.spacing(4),
        },
        ytDialog: {
            height: "100%",
        },
    })
);

const IndividualMoviePage: React.SFC<IndividualMoviePageProps> = () => {
    const classes = useStyles();
    const { movieId } = useParams<{ movieId: string }>();

    const [isOpen, setOpen] = React.useState(false);

    const [results] = useQuery({
        query: movieQuery,
        variables: { movieId },
    });

    const { fetching, data } = results;

    if (fetching)
        return (
            <div className={css(AnimationClassNames.fadeIn500)}>
                <div className={css(classes.container, AnimationClassNames.slideUpIn20)}>
                    <Card variant="outlined" className={classes.infoCard}>
                        <Skeleton className={classes.titleSkeleton} variant="rect" height={32} />
                        <Skeleton variant="rect" width="100%" height={600} />
                        <CardContent>
                            <Typography color="textSecondary" variant="subtitle1">
                                <Skeleton />
                            </Typography>
                            <Typography color="textSecondary" variant="subtitle1">
                                <Skeleton />
                            </Typography>
                            <Typography color="textSecondary" variant="subtitle1">
                                <Skeleton />
                            </Typography>
                            <Skeleton
                                height={40}
                                className={classes.skeletonButton}
                                variant="rect"
                            />
                            <Typography>
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </Typography>
                        </CardContent>
                    </Card>
                    <SkeletonSessionsOverviewCard />
                    <div></div>
                </div>
            </div>
        );

    if (!data.getMovie)
        return (
            <div className={css(classes.doesNotExist, AnimationClassNames.slideUpIn20)}>
                <Card className={classes.doesNotExistCard}>
                    <Typography align="center">This movie does not exist.</Typography>
                </Card>
            </div>
        );

    const {
        getMovie: { classification, director, duration, genre, id, name, plot, poster, trailerURL },
    } = data as MovieData;

    return (
        <>
            <ScrollToTop />
            <Helmet>
                <title>{name} - SPX Cinemas</title>
            </Helmet>
            <Dialog fullScreen open={isOpen}>
                <AppBar>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setOpen(false)}
                            aria-label="close"
                        >
                            <CloseRounded />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <YouTube
                    containerClassName={classes.ytDialog}
                    videoId={trailerURL.split("?v=")[1]}
                    opts={{
                        height: "100%",
                        width: "100%",
                        playerVars: {
                            autoplay: 1,
                        },
                    }}
                />
            </Dialog>
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
                            onClick={() => setOpen(true)}
                        >
                            Watch Trailer
                        </Button>
                        <Typography>{plot}</Typography>
                    </CardContent>
                </Card>
                <SessionsOverviewCard movieId={id} />
                <div></div>
            </div>
        </>
    );
};
export default IndividualMoviePage;
