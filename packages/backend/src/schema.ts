import {buildSchema, registerEnumType} from 'type-graphql';
import {OptionArea, OptionType, RoleType, StatusType, OptionMerge} from "@truecost/shared";
import {resolvers} from './modules';

const init = async () => {
    registerEnumType(RoleType, {name: "RoleType"});
    registerEnumType(StatusType, {name: "StatusType"});
    registerEnumType(OptionType, {name: "OptionType"});
    registerEnumType(OptionArea, {name: "OptionArea"});
    registerEnumType(OptionMerge, {name: "OptionMerge"});

    const schema = await buildSchema({
        resolvers: resolvers as any,
        dateScalarMode: "timestamp",
    });

    return schema;
};

export {init};
