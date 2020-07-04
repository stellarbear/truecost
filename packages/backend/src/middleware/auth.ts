import {MiddlewareFn} from "type-graphql";
import {assert} from "../helpers/assert";
import {RoleType} from "@truecost/shared";
import {Context} from "../server";

const UseAuth: (roles?: RoleType[]) => MiddlewareFn<Context> =
    (roles?: RoleType[]) => async ({context: {user}}, next) => {
        assert(user, "not authenticated");

        if (!roles || roles.length === 0) {
            return next();
        }

        assert(roles.includes(user.role), "not authorized");

        return next();
    };

export {UseAuth};
