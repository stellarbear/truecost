import {IUserContext} from "./useData";
import {useState} from "react";
import {IUser} from "@truecost/shared";

type IProps = IUserContext;

export function useUser(props: IProps) {
    const [state, setState] = useState<IUser | null>(
        props?.data?.active && props.data || null);

    return {state, setState};
}
