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
import { DateTime } from "luxon";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "urql";
import SkeletonSessionsOverviewCard from "./SkeletonSessionsOverviewCard";

export interface SessionsOverviewCardProps {
    movieId: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
        },
        loading: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
        },
        sessionPill: {
            width: 225,
            marginBottom: theme.spacing(2),
            marginRight: theme.spacing(2),
        },
    })
);

const sessionQuery = `
query getSessions($movieId: String!) {
    getMovie(id: $movieId) {
        id
        name
        sessions {
            id
            startTime
            endTime
        }
    }
}
`;

interface SessionData {
    getMovie: {
        id: string;
        name: string;
        sessions: {
            id: string;
            startTime: string;
            endTime: string;
        }[];
    };
}

const SessionsOverviewCard: React.SFC<SessionsOverviewCardProps> = ({ movieId }) => {
    const classes = useStyles();
    const history = useHistory();

    const [results] = useQuery({
        query: sessionQuery,
        variables: { movieId },
    });

    const { fetching, stale, data } = results;

    if (fetching || stale) return <SkeletonSessionsOverviewCard />;

    const {
        getMovie: { name, sessions },
    } = data as SessionData;

    return (
        <Card variant="outlined" className={classes.root}>
            <CardHeader title="Sessions" subheader={`Current available sessions for ${name}`} />
            <CardContent style={{ paddingTop: 0 }}>
                {sessions.length > 0 &&
                    sessions.map((s) => (
                        <Card
                            className={css(classes.sessionPill, AnimationClassNames.slideUpIn20)}
                            key={s.id}
                            variant="outlined"
                        >
                            <CardActionArea onClick={() => history.push(`/sessions/${s.id}`)}>
                                <CardContent>
                                    <Typography>
                                        {DateTime.fromISO(s.startTime).toFormat("EEEE, MMMM d")}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {DateTime.fromISO(s.startTime).toLocaleString(
                                            DateTime.TIME_SIMPLE
                                        )}{" "}
                                        -{" "}
                                        {DateTime.fromISO(s.endTime).toLocaleString(
                                            DateTime.TIME_SIMPLE
                                        )}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                {sessions.length === 0 && (
                    <Typography className={AnimationClassNames.slideUpIn20}>
                        Unfortunately, there are no sessions available for {name} at this time.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default SessionsOverviewCard;
