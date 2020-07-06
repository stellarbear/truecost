import {Redirect, RouteComponentProps, withRouter} from "react-router-dom";
import {useMutation} from "react-apollo";
import {gql} from "apollo-boost";
import React, {useState} from "react";
import {Button, CircularProgress, Typography} from "@material-ui/core";
import Meta from "pages/Base/Meta";

interface IMatchProps {
    id: string;
    session: string;
}

type IConfirmProps = RouteComponentProps<IMatchProps>;

const ConfirmUser = gql`
    mutation userConfirm ($id: String!, $confirm: String!) {
        userConfirm(id: $id, confirm: $confirm)
    }
`;

const Confirm: React.FC<IConfirmProps> = ({
                                              match: {params: {id, session}},
                                              history,
                                          }) => {
    if (!id || !session) {
        return <Redirect to={"home"}/>;
    }

    const [confirmMutation] = useMutation(ConfirmUser);
    const [isConfirming, setIsConfirming] = useState(false);

    const confirmUser = async () => {
        setIsConfirming(true);
        const result = await confirmMutation({variables: {id, confirm: session}});
        history.push('/');
    };

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: 64}}>
            <Meta page="confirm"/>
            <Typography style={{marginTop: 64}}>Once the email is verified</Typography>
            <Typography>you will be able to log in to your account</Typography>
            <Button style={{marginTop: 16}} onClick={() => confirmUser()}>
                {isConfirming ? <CircularProgress size={24}/> : "verify user email"}
            </Button>
        </div>
    );
};

export default withRouter(Confirm);
