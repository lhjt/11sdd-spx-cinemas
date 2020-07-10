import { AnimationClassNames, css } from "@fluentui/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    createStyles,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Snackbar,
    Theme,
    Typography,
} from "@material-ui/core";
import { DeleteRounded } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { DateTime } from "luxon";
import * as React from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useMutation } from "urql";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useCart } from "../../contexts/Cart";
import { HexString } from "../../utils/hexEncode";

export interface CartPageProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(4),
        },
    })
);

const createReservationMutation = `
mutation createReservation($data:ReservationDetails!) {
  createReservation(reservationDetails:$data)
}
`;

const CartPage: React.SFC<CartPageProps> = () => {
    const classes = useStyles();
    const { cart, setCart, creatingBooking, setCreatingBooking } = useCart();
    const { userAccount } = React.useContext(AuthenticationContext);
    const history = useHistory();

    const [snackbarOpen, setSnackbar] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState<string>("");

    const [_, executeMutation] = useMutation<{ createReservation: string }>(
        createReservationMutation
    );

    // const [isCreating, setCreating] = React.useState(false);

    function removeItemFromCart(sessionId: string, seatId: string) {
        const newCart = [...cart]
            .map((session) =>
                session.sessionId !== sessionId
                    ? session
                    : { ...session, seats: [...session.seats].filter((s) => s.id !== seatId) }
            )
            .filter((s) => s.seats.length > 0);
        setCart(newCart);
    }

    const createBooking = async () => {
        setCreatingBooking(true);

        const d = await executeMutation({
            data: {
                userId: userAccount!.uid,
                seats: cart
                    .map((s) => s.seats.map((ss) => ({ sessionId: s.sessionId, seatId: ss.id })))
                    .flat(),
            },
        });

        console.log(d);

        if (d.error) {
            setSnackbarText(d.error.message);
            setSnackbar(true);
            return setCreatingBooking(false);
        }

        if (typeof d?.data?.createReservation === "string") {
            setCart([]);
            setCreatingBooking(false);

            return history.replace(`/account/reservations/${d.data.createReservation}`);
        }
    };

    return (
        <div>
            <LinearProgress
                variant={creatingBooking ? "indeterminate" : "determinate"}
                value={creatingBooking ? undefined : 0}
            />
            <Helmet>
                <title>Cart - SPX Cinemas</title>
            </Helmet>
            <Card variant="outlined" className={css(classes.root, AnimationClassNames.slideUpIn20)}>
                <CardHeader title="Cart Summary" />
                {cart.length === 0 && (
                    <div style={{ padding: "1rem" }}>
                        <Typography>There are currently no items in your cart</Typography>
                    </div>
                )}
                {cart.length !== 0 && (
                    <div>
                        <List>
                            {cart.map((e) => {
                                return e.seats.map((s) => (
                                    <ListItem
                                        key={s.id + e.sessionId}
                                        button
                                        disabled={creatingBooking}
                                        onClick={() => history.push(`/sessions/${e.sessionId}`)}
                                    >
                                        <ListItemText
                                            primary={`${e.movieName} - Seat ${s.row.toUpperCase()}${
                                                s.seatNumber
                                            }`}
                                            secondary={`${DateTime.fromISO(
                                                e.startTime
                                            ).toLocaleString(
                                                DateTime.TIME_SIMPLE
                                            )} - ${DateTime.fromISO(e.endTime).toLocaleString(
                                                DateTime.TIME_SIMPLE
                                            )} (${DateTime.fromISO(e.startTime).toFormat(
                                                "EEEE, MMMM d"
                                            )}) `}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                disabled={creatingBooking}
                                                onClick={() =>
                                                    removeItemFromCart(e.sessionId, s.id)
                                                }
                                            >
                                                <DeleteRounded />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ));
                            })}
                        </List>
                        <CardContent>
                            {userAccount && (
                                <Button
                                    disabled={creatingBooking}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={createBooking}
                                >
                                    Create Reservation
                                </Button>
                            )}
                            {!userAccount && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                        history.push(`/login?continue=${HexString.create("cart")}`)
                                    }
                                >
                                    Login to Create Reservation
                                </Button>
                            )}
                        </CardContent>
                        {/* <CardContent></CardContent> */}
                    </div>
                )}
            </Card>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbar(false)}
            >
                <Alert severity="error">{snackbarText}</Alert>
            </Snackbar>
        </div>
    );
};

export default CartPage;
