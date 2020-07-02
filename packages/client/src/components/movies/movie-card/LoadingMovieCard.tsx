import { css } from "@fluentui/react";
import { Card, createStyles, Fade, makeStyles, Theme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import * as React from "react";

export interface LoadingMovieCardProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(1),
            width: 400,
        },
        skeleton: {
            margin: theme.spacing(2),
            marginBottom: theme.spacing(1),
            borderRadius: 5,
        },
        genres: {
            marginTop: theme.spacing(0),
        },
        image: {
            marginBottom: theme.spacing(1),
        },
        plot: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            "&:last-of-type": {
                marginBottom: theme.spacing(2),
            },
        },
    })
);

const LoadingMovieCard: React.SFC<LoadingMovieCardProps> = () => {
    const classes = useStyles();

    return (
        <Fade appear in>
            <Card className={classes.root}>
                <Skeleton className={classes.skeleton} variant="rect" height={32} />
                <Skeleton className={css(classes.skeleton, classes.genres)} />
                <Skeleton className={classes.image} variant="rect" height={500} />
                <Skeleton className={classes.plot} />
                <Skeleton className={classes.plot} />
                <Skeleton className={classes.plot} />
            </Card>
        </Fade>
    );
};

export default LoadingMovieCard;
