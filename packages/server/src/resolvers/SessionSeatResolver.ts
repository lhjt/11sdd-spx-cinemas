import { Arg, Query, Resolver } from "type-graphql";
import { SessionSeatModel } from "../schemas/SessionSeat";
import { SessionSeatsView } from "../schemas/views/SessionSeatsView";
enum IDType {
    sessionId = "sessionId",
    sessionSeatId = "id",
}

@Resolver(() => SessionSeatsView)
export class SessionSeatsResolver {
    private async aggregateSessionSeatsView(id: string, type: IDType): Promise<SessionSeatsView[]> {
        const matchObj: { [key: string]: unknown } = {};
        matchObj[type] = id;
        console.log(matchObj);
        const documents = (await SessionSeatModel.aggregate([
            {
                $match: matchObj,
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

    @Query(() => [SessionSeatsView])
    async getSessionSeats(@Arg("sessionId") sid: string): Promise<SessionSeatsView[]> {
        const documents = await this.aggregateSessionSeatsView(sid, IDType.sessionId);

        return documents;
    }

    @Query(() => SessionSeatsView, { nullable: true })
    async getSessionSeat(@Arg("sessionSeatId") sid: string): Promise<SessionSeatsView | null> {
        const documents = await this.aggregateSessionSeatsView(sid, IDType.sessionSeatId);

        if (documents.length === 1) return documents[0];
        return null;
    }
}
