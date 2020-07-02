import { AnimationClassNames, css } from "@fluentui/react";
import {
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    createStyles,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import * as React from "react";

export interface MovieCardProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(1),
            maxWidth: 400,
        },
        divider: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    })
);

const MovieCard: React.SFC<MovieCardProps> = (props) => {
    const classes = useStyles();

    return (
        <Card className={css(AnimationClassNames.slideUpIn20, classes.root)}>
            <CardActionArea>
                <CardHeader
                    title="Fifty Shades of Grey (2015)"
                    subheader="Drama, Romance, Thriller"
                />
                <img
                    src="https://image.tmdb.org/t/p/w1280/flL1rBYK8GUxaKgare1C7Z3QIcS.jpg"
                    style={{ width: "100%" }}
                    alt="Movie Name Poster"
                />
                {/* <Skeleton variant="rect" width={400} height={600} /> */}
                <CardContent>
                    <Typography variant="body1">
                        Literature student Anastasia Steele's life changes forever when she meets
                        handsome, yet tormented, billionaire Christian Grey.
                    </Typography>
                    {/* <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton /> */}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default MovieCard;
