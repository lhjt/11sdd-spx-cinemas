import { AnimationClassNames, css } from "@fluentui/react";
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    createStyles,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { MovieRounded } from "@material-ui/icons";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "urql";
import { AuthenticationContext, UserAccount } from "../../contexts/AuthenticationContext";

export interface AccountPageProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(2),
        },
    })
);

const userQuery = `
query getUserDetails($userId: String!) {
    getUserDetails(userId:$userId) {
        firstName
        lastName
        reservations {
            id
            seats {
                id
                session {
                    startTime
                    movie {
                        name
                    }
                }
            }
        }
    }
}
`;

interface UserDetails {
    getUserDetails: {
        firstName: string;
        lastName: string;
        reservations: {
            id: string;
            seats: {
                id: string;
                session: {
                    startTime: string;
                    movie: {
                        name: string;
                    };
                };
            }[];
        }[];
    };
}

const AccountPage: React.SFC<AccountPageProps> = () => {
    const classes = useStyles();
    const history = useHistory();

    const { userAccount: uac } = React.useContext(AuthenticationContext);
    const userAccount = uac as UserAccount;

    const [results] = useQuery({
        query: userQuery,
        variables: { userId: userAccount.uid },
    });

    const { fetching, data } = results;

    if (fetching && !data)
        return (
            <div>
                <CircularProgress />
            </div>
        );

    const {
        getUserDetails: { firstName, reservations },
    } = data as UserDetails;

    return (
        <Card variant="outlined" className={css(classes.root, AnimationClassNames.slideUpIn20)}>
            <CardHeader
                title={`Welcome, ${firstName}`}
                subheader="Here are your reservations with us"
            />
            <CardContent>
                <List>
                    {reservations.map((e) => (
                        <ListItem
                            key={e.id}
                            button
                            onClick={() => history.push(`/account/reservations/${e.id}`)}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <MovieRounded />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={Array.from(
                                    new Set(e.seats.map((s) => s.session.movie.name))
                                )
                                    .sort()
                                    .join(", ")}
                                secondary={`${
                                    new Set(e.seats.map((s) => s.session.movie.name)).size
                                } ${
                                    new Set(e.seats.map((s) => s.session.movie.name)).size > 1
                                        ? "Movies"
                                        : "Movie"
                                }`}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default AccountPage;
