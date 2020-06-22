import { Arg, Query, Resolver } from "type-graphql";
import { ReservationModel } from "../schemas/Reservation";
import { ReservationView } from "../schemas/views/ReservationView";

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
}
