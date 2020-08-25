import { DateTime } from "luxon";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Movie, MovieBase, MovieModel } from "../schemas/Movie";
import { SessionsView, SessionsViewModel } from "../schemas/views/SessionsView";

@Resolver(Movie)
export class MovieResolver {
    @Query(() => [Movie])
    async getMovies(): Promise<Movie[]> {
        return await MovieModel.find();
    }

    @Query(() => Movie, { nullable: true })
    async getMovie(@Arg("id") id: string): Promise<Movie | null> {
        return await MovieModel.findOne({ id });
    }

    @FieldResolver(() => [SessionsView])
    async sessions(@Root() movie: MovieBase): Promise<SessionsView[]> {
        return await SessionsViewModel.find({
            "movie.id": movie.id,
            startTime: { $gte: new Date(), $lte: DateTime.local().plus({ days: 7 }).toJSDate() },
        }).lean();
    }
}
