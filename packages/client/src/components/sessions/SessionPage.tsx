import { AnimationClassNames, css } from "@fluentui/react";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    createStyles,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Theme,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { CloseRounded, EventSeatRounded } from "@material-ui/icons";
import { DateTime } from "luxon";
import * as React from "react";
import { Helmet } from "react-helmet";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useQuery } from "urql";
import { ReservedSeat, SessionBooking, useCart } from "../../contexts/Cart";
import ScrollToTop from "../../utils/ScrollToTop";

const sessionQuery = `
query getSession($sessionId: String!) {
    getSession(id: $sessionId) {
        id
        movie {
            name
        }
        theatre {
            id
            name
        }
        startTime
        endTime
        reservedSeats {
            seat {
                id
            }
        }
        allSeats {
            id
            row
            seatNumber
        }
    }
}
`;

interface SessionData {
    getSession: {
        id: string;
        movie: {
            name: string;
        };
        theatre: {
            id: string;
            name: string;
        };
        startTime: string;
        endTime: string;
        reservedSeats: {
            seat: {
                id: string;
            };
        }[];
        allSeats: {
            id: string;
            row: string;
            seatNumber: number;
        }[];
    };
}

export interface SessionPageProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            margin: theme.spacing(4),
        },
        mainCard: {
            flexGrow: 1,
        },
        sessionSections: {
            display: "flex",
        },
        seatingGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(10, 40px)",
            gridTemplateRows: "repeat(8, 40px)",
            gap: "1px 1px",
            justifyItems: "center",
            alignItems: "center",
        },
        seatingGridContainer: {
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
        },
        sideInfo: {
            width: 300,
            display: "flex",
            flexDirection: "column",
            height: 400,
        },
        addToCartButton: {
            marginTop: theme.spacing(2),
        },
        seatingCardContent: { flexGrow: 1, display: "flex", alignItems: "center" },
        doesNotExist: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        doesNotExistCard: {
            margin: theme.spacing(4),
            padding: theme.spacing(4),
        },
    })
);

const SessionPage: React.SFC<SessionPageProps> = () => {
    const classes = useStyles();
    const { setCart, cart } = useCart();
    const match = useRouteMatch<{ sessionId: string }>();
    const history = useHistory();

    const { sessionId } = match.params;

    const alreadyReserved = cart.filter((e) => e.sessionId === sessionId)[0]?.seats;

    const [selectedSeats, setSelectedSeats] = React.useState<ReservedSeat[]>(
        !!alreadyReserved ? [...alreadyReserved] : []
    );

    const [result] = useQuery({
        query: sessionQuery,
        variables: { sessionId },
    });

    const { fetching, stale, data } = result;

    if (fetching || stale) return <CircularProgress />;

    if (!data.getSession)
        return (
            <div className={css(classes.doesNotExist, AnimationClassNames.slideUpIn20)}>
                <Card className={classes.doesNotExistCard}>
                    <Typography align="center">This session does not exist.</Typography>
                </Card>
            </div>
        );

    const {
        getSession: {
            allSeats,
            endTime,
            movie: { name: movieName },
            reservedSeats: reservedSeatObjects,
            startTime,
            theatre: { name: theatreName, id: theatreId },
        },
    } = data as SessionData;

    const reservedSeatIds = reservedSeatObjects.map((s) => s.seat.id);
    /**
     * Returns whether or not a seat has already been reserved.
     * @param id Seat ID
     */
    function isReserved(id: string) {
        return reservedSeatIds.includes(id);
    }

    const addSeat = (seat: ReservedSeat) => setSelectedSeats([...selectedSeats, seat]);
    const removeSeat = (seat: ReservedSeat) =>
        setSelectedSeats([...selectedSeats.filter((s) => s.id !== seat.id)]);

    return (
        <>
            <ScrollToTop />
            <Helmet>
                <title>{movieName} - Session at SPX Cinemas</title>
            </Helmet>
            <div className={css(classes.container, AnimationClassNames.slideUpIn20)}>
                <Card className={classes.mainCard} variant="outlined">
                    <CardHeader
                        title={`Session for ${movieName} on ${DateTime.fromISO(startTime).toFormat(
                            "EEEE, MMMM d"
                        )}`}
                        subheader={`${DateTime.fromISO(startTime).toLocaleString(
                            DateTime.TIME_SIMPLE
                        )} - ${DateTime.fromISO(endTime).toLocaleString(DateTime.TIME_SIMPLE)}`}
                    />
                    <Divider />
                    <div className={classes.sessionSections}>
                        <CardContent className={classes.seatingCardContent}>
                            <div className={classes.seatingGridContainer}>
                                <div>
                                    <div className={classes.seatingGrid}>
                                        {allSeats.map((s) =>
                                            isReserved(s.id) ? (
                                                <Tooltip arrow title="Reserved Seat">
                                                    <EventSeatRounded style={{ color: red[400] }} />
                                                </Tooltip>
                                            ) : selectedSeats
                                                  .map((seat) => seat.id)
                                                  .includes(s.id) ? (
                                                <IconButton
                                                    disableRipple
                                                    onClick={() => removeSeat(s)}
                                                >
                                                    <EventSeatRounded
                                                        style={{ color: green[400] }}
                                                    />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    disableRipple
                                                    onClick={() => addSeat(s)}
                                                >
                                                    <EventSeatRounded />
                                                </IconButton>
                                            )
                                        )}
                                    </div>
                                    <Divider style={{ marginTop: "1rem", marginBottom: ".5rem" }} />
                                    <Typography
                                        align="center"
                                        variant="subtitle1"
                                        color="textSecondary"
                                    >
                                        Screen
                                    </Typography>
                                </div>
                            </div>
                        </CardContent>
                        <Divider flexItem orientation="vertical" />
                        <CardContent>
                            <div className={classes.sideInfo}>
                                <List dense style={{ flexGrow: 1, overflowY: "scroll" }}>
                                    {selectedSeats.map((s) => (
                                        <ListItem className={AnimationClassNames.slideUpIn20}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <EventSeatRounded />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`Seat ${s.row.toUpperCase()}${
                                                    s.seatNumber
                                                }`}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => removeSeat(s)}
                                                >
                                                    <CloseRounded />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                                <Button
                                    className={classes.addToCartButton}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => {
                                        if (selectedSeats.length > 0) {
                                            const booking: SessionBooking = {
                                                endTime,
                                                movieName,
                                                sessionId,
                                                theatreId,
                                                startTime,
                                                seats: [...selectedSeats],
                                            };

                                            console.log(booking);
                                            setCart([
                                                ...cart.filter(
                                                    (b) => b.sessionId !== booking.sessionId
                                                ),
                                                booking,
                                            ]);
                                        } else {
                                            setCart([
                                                ...cart.filter((b) => b.sessionId !== sessionId),
                                            ]);
                                        }

                                        history.push("/movies");
                                    }}
                                >
                                    Update Cart
                                </Button>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default SessionPage;

// export interface SessionPageProps extends RouteComponentProps<{ sessionId: string }> {}

// export interface SessionPageState {}

// class SessionPage extends React.Component<SessionPageProps, SessionPageState> {
//     constructor(props: SessionPageProps) {
//         super(props);
//         this.state = {};
//     }

//     render() {
//         const { sessionId } = this.props.match.params;
//         return <Typography>{sessionId}</Typography>;
//     }
// }

// export default SessionPage;
