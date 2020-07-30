import {IUserContext} from "./useData";
import {useState} from "react";
import {IUser} from "@truecost/shared";

interface IProps extends IUserContext {
}

export function useUser(props: IProps) {
    const [state, setState] = useState<IUser | null>(
        props.data || null);

    return {state, setState};
}
