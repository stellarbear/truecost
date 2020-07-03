import {MiddlewareFn} from "type-graphql";
import {Context} from "..";
import {assert} from "../helpers/assert";
import {RoleType} from "@truecost/shared";

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
