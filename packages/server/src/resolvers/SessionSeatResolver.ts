import { Arg, Query, Resolver } from "type-graphql";
import { SessionSeatModel } from "../schemas/SessionSeat";
import { SessionSeatsView } from "../schemas/views/SessionSeatsView";

@Resolver(() => SessionSeatsView)
export class SessionSeatsResolver {
    @Query(() => [SessionSeatsView])
    async getSessionSeats(@Arg("sessionId") sid: string): Promise<SessionSeatsView[]> {
        const documents = (await SessionSeatModel.aggregate([
            {
                $match: {
                    sessionId: sid,
                },
            },
            {
                $lookup: {
                    from: "seats",
                    let: {
                        seatId: "$seat",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$seatId"],
                                },
                            },
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
                $project: {
                    _id: false,
                    reservation: false,
                    reserved: false,
                    session: false,
                    "seat._id": false,
                    "seat.theatre._id": false,
                },
            },
        ])) as SessionSeatsView[];

        return documents;
    }
}
