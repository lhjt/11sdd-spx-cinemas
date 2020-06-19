import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Reservation, ReservationModel } from "../schemas/Reservation";
import { User, UserBase, UserModel } from "../schemas/User";

@Resolver(User)
export class UserResolver {
    @Query(() => User, { nullable: true })
    async getUserDetails(@Arg("userId") userId: string): Promise<User | null> {
        return await UserModel.findOne({ id: userId });
    }

    @FieldResolver(() => [Reservation])
    async reservations(@Root() user: UserBase): Promise<Reservation[]> {
        // TODO: Create View for this Query, so that information regarding each reservation
        // TODO: can easily be accessed without needing another query
        return await ReservationModel.find({ userId: user.id }).populate("seats").lean();
    }
}
