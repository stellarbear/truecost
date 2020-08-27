import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {UserEntity} from "../../crud/user/user.entity";
import {Context, sessionCookieName} from "../../../server";
import {assert} from "../../../helpers/assert";
import {pbkdf2} from "../../../helpers/pbkdf2";
import {v4} from "uuid";
import {redis} from "../../../redis";
import {DI} from "../../../orm";

//TODO: session middleware
@Resolver()
export class SessionResolver {
    userRepo = DI.em.getRepository(UserEntity);

    @Mutation(() => UserEntity)
    async UserLogin(
        @Ctx() ctx: Context,
        @Arg("email") email: string,
        @Arg("password") password: string,
    ) {
        email = email.toLocaleLowerCase().trim();
        assert(ctx.req.session, "session failure");

        const user = await this.userRepo.findOne({email});
        assert(user, "user not found");
        assert(user.verified, "user not yet verified");
        assert(user.active, "account disabled");
        assert(user.salt, "You need to do a password recovery. Please, click the button below (forgot password) and follow the instructions")

        const verify = await pbkdf2.validate(user.password, password, user.salt);
        assert(verify, "invalid password");

        const session = v4();
        await redis.client.sadd(`user-${user.id}`, session);
        await redis.client.set(`session-${session}`, user.id, "ex", redis.duration.week);
        ctx.req.session.sid = session;

        return user;
    }

    @Mutation(() => Boolean)
    async UserInvalidate(@Ctx() ctx: Context) {
        assert(ctx.req.session, "session failure");
        const {sid} = ctx.req.session;
        assert(sid, "must be logged in");

        const userId = await redis.client.get(`session-${sid}`);
        if (userId) {
            return false;
        }

        const sessionIds = await redis.client.smembers(`user-${userId}`);
        await redis.client.del(sessionIds.map(s => `session-${s}`))
        await redis.client.del(`user-${userId}`);

        return true;
    }

    @Mutation(() => Boolean)
    async UserLogout(@Ctx() ctx: Context) {
        assert(ctx.req.session, "session failure");
        const {sid} = ctx.req.session;
        assert(sid, "already logged out");

        const userId = await redis.client.get(`session-${sid}`);
        await redis.client.del(`session-${sid}`);
        if (userId) {
            await redis.client.srem(userId, sid);
        }

        return true;
    }

    @Query(() => UserEntity, {nullable: true})
    async UserWhoAmI(
        @Ctx() ctx: Context) {
        assert(ctx.req.session, "session failure");
        const {sid} = ctx.req.session;
        if (!sid) {
            return null;
        }

        const userId = await redis.client.get(`session-${sid}`);
        if (!userId) {
            return null;
        }

        const user = await DI.em.findOne(DI.map.user, {id: userId});

        return user;
    }
}
