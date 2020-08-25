import { DocumentType, isDocument } from "@typegoose/typegoose";
import { DateTime } from "luxon";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { ReservationModel } from "../schemas/Reservation";
import { Session } from "../schemas/Session";
import { SessionSeat, SessionSeatModel } from "../schemas/SessionSeat";
import { SessionsView, SessionsViewModel } from "../schemas/views/SessionsView";

@Resolver(SessionsView)
export class SessionResolver {
    @Query(() => [SessionsView])
    async getSessions(): Promise<Session[]> {
        return await SessionsViewModel.find().limit(20).lean();
    }

    @Query(() => SessionsView, { nullable: true })
    async getSession(@Arg("id") id: string): Promise<SessionsView | null> {
        return await SessionsViewModel.findOne({
            id,
            startTime: { $gte: DateTime.local().toJSDate() },
        }).lean();
    }

    @Mutation(() => Boolean)
    async cancelBooking(@Arg("id") id: string): Promise<boolean> {
        const reservation = await ReservationModel.findOne({ id });

        if (!reservation) return false;

        // Check each session in reservation to ensure that
        // it is not in the past
        const seats: DocumentType<SessionSeat>[] = [];
        for (const seatID of reservation.seats) {
            console.log("SeatID:", seatID);
            const seat = await SessionSeatModel.findOne({ _id: seatID }).populate("session");
            console.log(seat);

            if (!seat) return false;
            if (!isDocument(seat.session)) return false;

            if (new Date(seat.session.startTime) < new Date()) return false;
            seats.push(seat);
        }

        for (const seat of seats) {
            await seat.remove();
        }

        await reservation.remove();

        return true;
    }
}
