import { Arg, Query, Resolver } from "type-graphql";
import { ReservationModel } from "../schemas/Reservation";
import { ReservationView } from "../schemas/views/ReservationView";

@Resolver(ReservationView)
export class ReservationResolver {
    @Query(() => [ReservationView])
    async getReservations(@Arg("userId") uid: string): Promise<ReservationView[]> {
        const reservations = (await ReservationModel.aggregate([
            {
                $match: {
                    userId: uid,
                },
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
        ])) as ReservationView[];

        console.log(reservations);
        return reservations;
    }
}
