import {MiddlewareFn} from "type-graphql";
import {assert} from "../helpers/assert";
import {RoleType} from "@truecost/shared";
import {Context} from "../server";
import {DI} from "../orm";
import {redis} from "../redis";

const UseAuth: (roles?: RoleType[]) => MiddlewareFn<Context> =
    (roles?: RoleType[]) => async ({context: {req}}, next) => {
        assert(req.session, "session failure");
        
        const {id} = req.session;
        assert(id, "must be logged in");

        const userId = await redis.client.get(`session-${id}`);
        assert(userId, "key not found");

        const user: any = await DI.em.findOne(DI.map.user, {id: userId});
        assert(user, "user not found");

        if (!roles || roles.length === 0) {
            return next();
        }

        assert(roles.includes(user.role), "not authorized");

        return next();
    };

export {UseAuth};
