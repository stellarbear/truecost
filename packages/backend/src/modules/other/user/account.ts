import {Arg, Mutation, Resolver} from "type-graphql";
import {UserEntity} from "../../crud/user/user.entity";
import {DI} from "../../../orm";
import {v4} from "uuid";
import {assert} from "../../../helpers/assert";
import {wrap} from "mikro-orm";
import {pbkdf2} from "../../../helpers/pbkdf2";
import {redis} from "../../../redis";
import {RoleType, validate} from "@truecost/shared";
import {composeEmail} from "../../../mail/compose";
import {verificationEmail} from "../../../mail/samples/verification";
import {domain} from "../../../mail/helpers";
import {forgetEmail} from "../../../mail/samples/forget";

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
        assert(!["root", "mod", "admin", "truecost"].some(s => name.includes(s)), "bad name", ["name"]);
        assert(name.replace(/[a-zA-Z0-9_]/g, "").length == 0, "bad alphabet", ["name"]);
        assert(validate("email").test(email), "Does not look like email (:", ["email"]);

        let user = await this.userRepo.findOne({email});
        if (user) {
            assert(!user.verified, "user already verified");
            assert(!user.active, "account is disabled");
        }

        const {hash, salt} = await pbkdf2.generate(password);
        user = user ?? this.userRepo.create({});

        wrap(user).assign({
            role: RoleType.USER,
            verified: false,
            password: hash,
            active: true,
            email,
            name,
            salt,
        });

        await this.userRepo.persistAndFlush(user);

        try {
            const verify = v4();

            await composeEmail({
                to: email,
                template: verificationEmail(verify, user.id),
                subject: 'Account verification',
                text: `Verification link: ${domain}/register/verify/${verify}/${user.id}`
            })
            await redis.client.set(`verify-${verify}`, user.id, "ex", redis.duration.day);
        } catch (e) {
            assert(false, e);
        }

        return true;
    }

    @Mutation(() => UserEntity)
    async UserVerify(
        @Arg("verify") verify: string,
        @Arg("value") value: string,
    ) {
        const userId = await redis.client.get(`verify-${verify}`);
        assert(userId, "key not found");
        assert(userId === value, "key not found");

        const user = await this.userRepo.findOne({id: userId});
        assert(user, "user not found");

        user.verified = true;
        await this.userRepo.persistAndFlush(user);
        await redis.client.del(`verify-${verify}`);

        return user;
    }

    @Mutation(() => Boolean)
    async PasswordForget(
        @Arg("email") email: string,
    ) {
        const user = await this.userRepo.findOne({email});
        assert(user, "user not found");

        try {
            const forget = v4();

            await composeEmail({
                to: email,
                template: forgetEmail(forget, user.id),
                subject: 'Password reset',
                text: `Password reset link: ${domain}/password/forget/${forget}/${user.id}`
            })
            await redis.client.set(`forget-${forget}`, user.id, "ex", redis.duration.hour);
        } catch (e) {
            assert(false, e);
        }

        return true;
    }

    @Mutation(() => UserEntity)
    async PasswordReset(
        @Arg("forget") forget: string,
        @Arg("value") value: string,
        @Arg("password") password: string,
    ) {
        const userId = await redis.client.get(`forget-${forget}`);
        assert(userId, "key not found");
        assert(userId === value, "key not found");

        const user = await this.userRepo.findOne({id: userId});
        assert(user, "user not found");

        const {hash, salt} = await pbkdf2.generate(password);
        user.password = hash;
        user.salt = salt;

        await this.userRepo.persistAndFlush(user);
        await redis.client.del(`forget-${forget}`);

        return user;
    }
}
