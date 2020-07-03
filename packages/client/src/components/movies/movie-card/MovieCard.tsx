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
import { useHistory } from "react-router";

export interface MovieCardProps {
    name: string;
    genre: string[];
    plot: string;
    poster: string;
    id: string;
}

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

const MovieCard: React.SFC<MovieCardProps> = ({ genre, name, plot, poster, id }) => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <Card className={css(AnimationClassNames.slideUpIn20, classes.root)}>
            <CardActionArea onClick={() => history.push(`/movies/${id}`)}>
                <CardHeader
                    title={name}
                    subheader={genre.map((g) => g.charAt(0).toUpperCase() + g.slice(1)).join(", ")}
                />
                <img
                    draggable="false"
                    src={poster}
                    style={{ width: "100%" }}
                    alt={name + " Poster"}
                />
                <CardContent>
                    <Typography variant="body1">{plot}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default MovieCard;
