import * as React from "react";
import {Breadcrumbs, Link} from '@material-ui/core';
import {useHistory} from "react-router";

type IOption = [string, string];

interface IProps {
    options: IOption[];
}

export const BreadCrumbs: React.FC<IProps> = (props) => {
    const {options} = props;
    const history = useHistory();

    const onNavigate = React.useCallback((to: string) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        history.push(to);
    }, []);

    return (

        <Breadcrumbs aria-label="breadcrumb">
            {options.map(([to, name], index) => (
                <Link onClick={onNavigate(to)} key={index} color="inherit" href={to}>
                    {name}
                </Link>
            ))}
        </Breadcrumbs>
    );
};
