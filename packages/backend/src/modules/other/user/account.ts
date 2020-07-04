import {Arg, Mutation, Resolver} from "type-graphql";
import {UserEntity} from "../../crud/user/user.entity";
import {DI} from "../../../orm";
import {v4} from "uuid";
import {assert} from "../../../helpers/assert";
import {wrap} from "mikro-orm";
import {pbkdf2} from "../../../helpers/pbkdf2";
import {redis} from "../../../redis";
import {RoleType} from "@truecost/shared";

@Resolver(() => UserEntity)
export class AccountResolver {
    userRepo = DI.em.getRepository(UserEntity);

    @Mutation(() => Boolean)
    async UserCreate(
        @Arg("name") name: string,
        @Arg("email") email: string,
        @Arg("password") password: string) {
        name = name.trim();
        assert(name.length < 64, "name length must be <= 64", ["name"]);
        assert(!["root", "mod", "admin", ""].includes(name), "bad name", ["name"]);
        assert(name.replace(/[a-zA-Z0-9_]/g, "").length == 0, "bad alphabet", ["name"]);

        let user = await this.userRepo.findOne({email});
        assert(!user || user.role === RoleType.ANON, "user already exists");

        const {hash, salt} = await pbkdf2.generate(password);
        user = user ?? this.userRepo.create({});

        wrap(user).assign({
            role: RoleType.USER,
            confirmed: false,
            password: hash,
            session: v4(),
            active: true,
            email,
            name,
            salt,
        });

        await this.userRepo.persistAndFlush(user);

        const key = `${redis.keys.confirm}:${v4()}`;
        await redis.client.set(key, user.id, "ex", redis.duration.day);

        return true;
    }

    @Mutation(() => Boolean)
    async UserConfirmResend(
        @Arg("email") email: string,
    ) {
        const user = await this.userRepo.findOne({email});
        assert(user, "email not found", ["email"]);

        //send email

        const key = `${redis.keys.confirm}:${v4()}`;
        await redis.client.set(key, user.id, "ex", redis.duration.day);

        return true;
    }

    @Mutation(() => Boolean)
    async UserConfirm(
        @Arg("confirm") confirm: string,
    ) {
        const key = `${redis.keys.confirm}:${confirm}`;
        const id = await redis.client.get(key);
        assert(id, "key not found");

        const user = await this.userRepo.findOne({id});
        assert(user, "user not found");

        user.confirmed = true;
        await redis.client.del(key);
        await this.userRepo.persistAndFlush(user);

        return true;
    }

    @Mutation(() => Boolean)
    async UserForget(
        @Arg("id") id: string,
    ) {
        const user = await this.userRepo.findOne({id});
        assert(user, "user not found", ["user"]);

        const key = `${redis.keys.forget}:${v4()}`;
        await redis.client.set(key, user.id, "ex", redis.duration.day);

        try {
            //email send
            return true;
        } catch {
            await redis.client.del(key);
            return false;
        }
    }

    @Mutation(() => Boolean)
    async UserReset(
        @Arg("forget") forget: string,
        @Arg("password") password: string,
    ) {
        const key = `${redis.keys.forget}:${forget}`;
        const id = await redis.client.get(key);
        assert(id, "key not found");

        const user = await this.userRepo.findOne({id});
        assert(user, "user not found");

        const {hash, salt} = await pbkdf2.generate(password);

        wrap(user).assign({
            password: hash,
            session: v4(),
            salt,
        });
        await this.userRepo.persistAndFlush(user);
        await redis.client.del(key);
        return true;
    }
}
