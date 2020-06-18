import { Arg, Query, Resolver } from "type-graphql";
import { Reservation, ReservationModel } from "../schemas/Reservation";

// TODO: Need to fix reservation resolver

@Resolver(Reservation)
export class ReservationResolver {
    @Query(() => [Reservation])
    async getReservations(@Arg("userId") uid: string): Promise<Reservation[]> {
        return await ReservationModel.find({ userId: uid });
    }
}
