import { Arg, Query, Resolver } from "type-graphql";
import { Session } from "../schemas/Session";
import { SessionsView, SessionsViewModel } from "../schemas/views/SessionsView";

@Resolver(SessionsView)
export class SessionResolver {
    @Query(() => [SessionsView])
    async getSessions(@Arg("afterDate", { nullable: true }) after?: Date): Promise<Session[]> {
        if (after) {
            return await SessionsViewModel.find({ startTime: { $gte: after } }).lean();
        } else {
            return await SessionsViewModel.find().limit(20).lean();
        }
    }

    // @Query(() => [SessionsView])

    @Query(() => SessionsView, { nullable: true })
    async getSession(@Arg("id") id: string): Promise<SessionsView | null> {
        return await SessionsViewModel.findOne({ id }).lean();
    }
}
