import { DocumentType } from "@typegoose/typegoose";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { v4 as uuidv4 } from "uuid";
import { Reservation, ReservationModel } from "../schemas/Reservation";
import { SeatModel } from "../schemas/Seat";
import { SessionModel } from "../schemas/Session";
import { SessionSeat, SessionSeatModel } from "../schemas/SessionSeat";
import { UserModel } from "../schemas/User";
import { ReservationView } from "../schemas/views/ReservationView";

@InputType()
class ReservationSeatDetails {
    @Field()
    sessionId!: string;
    @Field()
    seatId!: string;
}

@InputType()
class ReservationDetails {
    @Field()
    userId!: string;

    @Field(() => [ReservationSeatDetails])
    seats!: ReservationSeatDetails[];
}

@Resolver(ReservationView)
export class ReservationResolver {
    public static async aggregateReservationView(
        uid: string,
        rid?: string
    ): Promise<ReservationView[]> {
        const matchObj: { userId: string; id?: string } = { userId: uid };
        if (rid) matchObj.id = rid;

        return await ReservationModel.aggregate([
            {
                $match: matchObj,
            },
            {
                $lookup: {
                    from: "session-seats",
                    let: {
                        reservationId: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$reservation", "$$reservationId"],
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: "sessions",
                                let: {
                                    sessionId: "$session",
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$sessionId"],
                                            },
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: "movies",
                                            localField: "movie",
                                            foreignField: "_id",
                                            as: "movie",
                                        },
                                    },
                                    {
                                        $unwind: "$movie",
                                    },
                                    {
                                        $lookup: {
                                            from: "theatres",
                                            localField: "theatre",
                                            foreignField: "_id",
                                            as: "theatre",
                                        },
                                    },
                                    {
                                        $unwind: "$theatre",
                                    },
                                ],
                                as: "session",
                            },
                        },
                        {
                            $unwind: "$session",
                        },
                        {
                            $lookup: {
                                from: "seats",
                                localField: "seat",
                                foreignField: "_id",
                                as: "seat",
                            },
                        },
                        {
                            $unwind: "$seat",
                        },
                    ],
                    as: "seats",
                },
            },
        ]);
    }

    @Query(() => [ReservationView])
    async getReservations(@Arg("userId") uid: string): Promise<ReservationView[]> {
        const reservations = await ReservationResolver.aggregateReservationView(uid);

        console.log(reservations);
        return reservations;
    }

    @Query(() => ReservationView, { nullable: true })
    async getReservation(
        @Arg("userId") uid: string,
        @Arg("reservationId") rid: string
    ): Promise<ReservationView | null> {
        const reservation = await ReservationResolver.aggregateReservationView(uid, rid);
        if (reservation.length === 1) return reservation[0];
        return null;
    }

    // @Mutation()
    // createReservation(reservationDetails!) => Reservation!
    @Mutation(() => String)
    async createReservation(
        @Arg("reservationDetails") { seats, userId }: ReservationDetails
    ): Promise<string> {
        const reservation = new Reservation();
        reservation.id = uuidv4();

        const user = await UserModel.findOne({ id: userId });
        if (!user) throw new Error("User does not exist.");

        reservation.user = user;
        reservation.userId = user.id;

        const reservationDocument = new ReservationModel(reservation);

        const reservationSeats: DocumentType<SessionSeat>[] = [];
        for (const { seatId, sessionId } of seats) {
            // Get the seats from the database based on the id
            const seatDocument = await SeatModel.findOne({ id: seatId });
            if (!seatDocument) throw new Error("Specified seat does not exist.");
            if (await this.seatIsAlreadyBooked(sessionId, seatId))
                throw new Error(`${seatId} ${sessionId}`);

            // Find the session
            const sessionDocument = await SessionModel.findOne({ id: sessionId });
            if (!sessionDocument) throw new Error("Specified session does not exist.");

            // At this point, the seat is free and can be booked
            const sessionSeat = new SessionSeat();
            sessionSeat.id = uuidv4();
            sessionSeat.reservation = reservationDocument;
            sessionSeat.reserved = true;
            sessionSeat.seat = seatDocument._id;
            sessionSeat.session = sessionDocument;
            sessionSeat.sessionId = sessionDocument.id;

            // SessionSeat document has been constructed
            const sessionSeatDocument = new SessionSeatModel(sessionSeat);
            await sessionSeatDocument.save();
            reservationSeats.push(sessionSeatDocument);
        }

        reservationDocument.seats = reservationSeats;

        await reservationDocument.save();
        return reservationDocument.id;
    }

    /**
     * Check if a seat has already been booked for a specific session
     * @param sessionId
     * @param seatId
     */
    async seatIsAlreadyBooked(sessionId: string, seatId: string): Promise<boolean> {
        const documents = await SessionSeatModel.aggregate([
            {
                $match: {
                    sessionId: sessionId,
                },
            },
            {
                $lookup: {
                    from: "seats",
                    localField: "seat",
                    foreignField: "_id",
                    as: "seat",
                },
            },
            {
                $unwind: {
                    path: "$seat",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    "seat.id": seatId,
                },
            },
        ]);

        return documents.length !== 0;
    }
}
