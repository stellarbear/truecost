import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {UserEntity} from "../../crud/user/user.entity";
import {Context, sessionCookieName} from "../../../server";
import {assert} from "../../../helpers/assert";
import {pbkdf2} from "../../../helpers/pbkdf2";
import {v4} from "uuid";
import {redis} from "../../../redis";
import {DI} from "../../../orm";

const destroySession = (ctx: Context) => {
    return new Promise((res, rej) =>
        ctx.req.session &&
        ctx.req.session.destroy(err => {
            if (err) {
                return rej(false);
            }

            ctx.res.clearCookie(sessionCookieName);
            return res(true);
        }),
    );
};

@Resolver()
export class SessionResolver {
    userRepo = DI.em.getRepository(UserEntity);

    @Mutation(() => UserEntity)
    async UserLogin(
        @Ctx() ctx: Context,
        @Arg("email") email: string,
        @Arg("password") password: string,
    ) {
        const user = await this.userRepo.findOne({email});
        assert(user, "user not found");
        assert(user.confirmed, "user not yet confirmed");
        assert(user.active, "account disabled");

        const verify = await pbkdf2.validate(user.password, password, user.salt);
        assert(verify, "invalid password");

        const session = v4();
        const key = `${redis.keys.session}:${session}`;

        await redis.client.set(key + '-user', user.id, "ex", redis.duration.month);
        await redis.client.set(key + '-session', user.session, "ex", redis.duration.month);

        assert(ctx.req.session, "session failure");
        ctx.req.session.sid = session;

        return user;
    }

    @Mutation(() => Boolean)
    async UserInvalidate(@Ctx() ctx: Context) {
        const {user} = ctx;
        assert(user, "user not found");

        user.session = v4();
        await this.userRepo.persistAndFlush(user);

        return destroySession(ctx);
    }

    @Mutation(() => Boolean)
    async UserLogout(@Ctx() ctx: Context) {
        assert(ctx.req.session, "session failure");
        const {sid} = ctx.req.session;
        assert(sid, "already logged out");

        const key = `${redis.keys.session}:${sid}`;
        await redis.client.del(key + '-user');
        await redis.client.del(key + '-session');

        return destroySession(ctx);
    }

    @Query(() => UserEntity, {nullable: true})
    async UserWhoAmI(
        @Ctx() ctx: Context) {
        return ctx.user;
    }
}
