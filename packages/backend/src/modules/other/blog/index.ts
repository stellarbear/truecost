import {Arg, Query, Resolver} from "type-graphql";
import {DI} from "../../../orm";
import {BlogEntity} from "../../crud/blog/blog.entity";

@Resolver(() => BlogEntity)
export class BlogResolver {
    blogRepo = DI.em.getRepository(BlogEntity);

    @Query(() => BlogEntity, {nullable: true})
    async BlogUrl(
        @Arg("url") url: string,
    ) {
        const blog = await this.blogRepo.findOne({url, active: true});
        
        return blog;
    }
}
