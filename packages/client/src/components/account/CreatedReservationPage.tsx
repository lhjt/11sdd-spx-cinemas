import { AnimationClassNames, css } from "@fluentui/react";
import {
    Avatar,
    Button,
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
    Typography,
} from "@material-ui/core";
import { EventSeatRounded } from "@material-ui/icons";
import { DateTime } from "luxon";
import QRCode from "qrcode.react";
import * as React from "react";
import { Helmet } from "react-helmet";
import { useHistory, useRouteMatch } from "react-router";
import { useMutation, useQuery } from "urql";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

export interface CreatedReservationPageProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(2),
        },
        bookingReference: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        referenceTitle: {
            marginBottom: theme.spacing(2),
        },
    })
);

const reservationQuery = `
query getReservationDetails($uid: String!, $rid: String!) {
    getReservation(userId:$uid, reservationId: $rid) {
        id
        reservationDate
        seats {
            id
            session {
                movie {
                    id
                    name
                }
                startTime
                theatre {
                    name
                }
            }
            seat {
                id
                row
                seatNumber
            }
        }
    }
}
`;

interface reservationData {
    getReservation: {
        id: string;
        reservationDate: string;
        seats: {
            id: string;
            session: {
                movie: {
                    id: string;
                    name: string;
                };
                startTime: string;
                theatre: {
                    name: string;
                };
            };
            seat: {
                id: string;
                row: string;
                seatNumber: number;
            };
        }[];
    } | null;
}

const CreatedReservationPage: React.SFC<CreatedReservationPageProps> = () => {
    const match = useRouteMatch<{ reservationId: string }>();
    const history = useHistory();
    const account = React.useContext(AuthenticationContext);
    const classes = useStyles();

    const rid = match.params.reservationId;

    const [result] = useQuery({
        query: reservationQuery,
        variables: { uid: account.userAccount!.uid, rid },
    });

    const [mutationResult, executeMutation] = useMutation<{
        cancelBooking: string;
    }>(`mutation cancelBooking($id:String!) {
        cancelBooking(id:$id)
      }`);

    const { fetching, data, error } = result;

    if (fetching && !data) return <CircularProgress />;

    if (error) {
        history.replace("/account");
    }

    const { getReservation: reservationData } = data as reservationData;

    if (!reservationData) {
        history.replace("/account");
        return <div></div>;
    }

    const { id, seats, reservationDate } = reservationData;

    const cancelBooking = async () => {
        const mutationResult = await executeMutation({
            id,
        });

        console.log(mutationResult);
        history.replace("/account");
    };

    function canDelete(): boolean {
        const seatDates = seats.map((s) => new Date(s.session.startTime));
        for (const date of seatDates) {
            if (date < new Date()) return false;
        }

        return true;
    }

    return (
        <Card className={css(classes.root, AnimationClassNames.slideUpIn20)}>
            <Helmet>
                <title>Reservation - SPX Cinemas</title>
            </Helmet>
            <CardHeader title="Reservation Details" />
            <CardContent>
                <div className={classes.bookingReference}>
                    <Typography variant="h5" className={classes.referenceTitle}>
                        Here's your reservation reference:
                    </Typography>
                    <QRCode
                        value={rid}
                        // includeMargin
                        style={{ padding: "1rem" }}
                        size={256}
                        bgColor="#424242"
                        fgColor="#FFFFFF"
                    />
                    <Typography variant="caption" color="textSecondary">
                        {rid}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Present this to the cinema staff for scanning
                    </Typography>
                    {canDelete() && (
                        <Button
                            onClick={() => cancelBooking()}
                            style={{ marginTop: "1rem" }}
                            variant="contained"
                            color="primary"
                        >
                            Cancel Reservation
                        </Button>
                    )}
                </div>
                <List>
                    {seats.map((s) => (
                        <ListItem
                            button
                            onClick={() => history.push(`/movies/${s.session.movie.id}`)}
                            key={s.id}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <EventSeatRounded />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${
                                    s.session.movie.name
                                } - Seat ${s.seat.row.toUpperCase()}${
                                    s.seat.seatNumber
                                } | Cinema: ${s.session.theatre.name}`}
                                secondary={`${DateTime.fromISO(s.session.startTime).toLocaleString(
                                    DateTime.DATETIME_SHORT
                                )}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default CreatedReservationPage;
