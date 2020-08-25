import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware, Subscription} from "type-graphql";
import {DI} from "../../orm";
import {MetaEntity} from "../crud/meta/meta.entity";



//TODO: session middleware
@Resolver()
export class MetaResolver {
    metaRepo = DI.em.getRepository(MetaEntity);

    @Query(() => String, {nullable: true})
    async MetaCurrent(
        @Arg('url') url: string
    ) {
        const result = await this.metaRepo.findOne({url: {$eq: url}});

        return result?.metatag;
    }
}