import React, {useEffect, useState} from "react";
import {
    Button,
    CircularProgress,
    createStyles,
    Divider,
    IconButton,
    makeStyles,
    TextField,
    Theme,
    Typography,
} from "@material-ui/core";
import gql from "graphql-tag";
import {useLazyQuery} from "react-apollo";
import OrderPanel, {Order} from "./Base/OrderPanel";
import {validateEmail} from "auxiliary/validate";
import {generateCaptcha} from "auxiliary/captcha";
import {ErrorLabel, InputField} from "components";
import {AccountCircle, Refresh} from "@material-ui/icons";
import {DistortionText} from "captcha";
import {parseQLErrors} from "auxiliary";
import Meta from "./Base/Meta";
import {DataContext} from "./Data/Wrapper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            maxWidth: 600,
            flexDirection: "row",
            [theme.breakpoints.down(658)]: {
                margin: "0px 10px 10px",
            },
            [theme.breakpoints.up(658)]: {
                margin: "0px auto 30px",
            },
            [theme.breakpoints.up(1600)]: {
                margin: "0px auto 30px",
            },
        },
        font: {
            marginTop: 4,
        },
    }),
);

interface IOrderProps {
}

const GET_ORDER = gql`
    query orderGetById($id: String!, $email: String!) {
        orderGetById (id: $id, email: $email) {
            id
            name
            details
            createdAt
            metadata
            status
            history
        }
    }
`;


interface IState {
    captcha: string;
    id: string;
    email: string;
}

const defaultState = (user?: IUser) => ({
    email: user?.email ?? "",
    captcha: "",
    id: "",
});

const TrackOrder: React.FC<IOrderProps> = () => {
    const classes = useStyles();
    const {store: {user: {data: user}}} = React.useContext(DataContext);
    const [orderQuery, {data, loading, error}] = useLazyQuery(GET_ORDER, {fetchPolicy: 'cache-and-network'});
    const [orders, setOrders] = useState<Order[]>([]);

    const [captcha, setCaptcha] = useState<string | null>(generateCaptcha());
    const [state, setState] = useState<IState>({...defaultState(user)});
    const [errors, setErrors] = useState<IState>({...defaultState()});

    useEffect(() => {
        if (user) {
            setState(defaultState(user));
        }
    }, [user]);
    useEffect(() => {
        if (data?.orderGetById) {
            setOrders(data.orderGetById);
        }
    }, [data]);

    const onChange = (propName: keyof IState, value: string | boolean): void => {
        const newState = {...state, [propName]: value};
        setState(newState);
    };

    const validate = (): boolean => {
        const newErrors = {...defaultState()};
        const {email, id, captcha: stateCaptcha} = state;
        if (id.length !== 36) {
            newErrors.id = "this is not an id";
        }
        if (!email) {
            newErrors.email = "must not be empty";
        }
        if (!validateEmail(email)) {
            newErrors.email = "invalid email format";
        }
        if (captcha != stateCaptcha) {
            newErrors.captcha = "wrong captcha";
        }
        setErrors(newErrors);

        return (Object.values(newErrors).join("").length === 0);
    };

    const onTrack = async (): Promise<void> => {
        if (loading || !validate()) {
            return;
        }

        const {id, email} = state;

        try {
            await orderQuery({variables: {id, email}});
            window.scrollBy({top: 600, behavior: "smooth"});
        } catch (error) {
            const QLErrors = parseQLErrors(error);
            setErrors({...defaultState(), ...QLErrors});
        } finally {
            //setCaptcha(generateCaptcha())
        }
    };

    const renderOrder = () => {
        if (loading || error || orders.length === 0) {
            return null;
        }

        return (
            <div
                style={{
                    overflow: "hidden",
                    marginTop: 16,
                    borderRadius: 6,
                    width: "100%",
                    display: "flex", flexDirection: "column", alignItems: "flex-end",
                }}
            >
                {orders.map((order, i) => (
                    <div key={`order-${i}`} style={{width: "100%", marginBottom: 8}}>
                        <OrderPanel order={order}/>
                    </div>
                ))}
            </div>
        );
    };

    const renderInfo = () => (
        <div style={{
            width: "100%",
        }}>
            <React.Fragment>
                <Typography
                    component="div"
                    variant="caption"
                    style={{whiteSpace: "pre-wrap", textAlign: "center", marginBottom: 8}}
                >{`You may browse all of your orders\non the account page once you log in`}</Typography>
                <Divider/>
            </React.Fragment>
        </div>
    );

    const renderSubmitForm = () => (
        <div style={{maxWidth: 400, margin: "auto"}}>
            {renderInfo()}
            <ErrorLabel error={errors.id}>
                <InputField label={"id"} value={state.id} onChangeEvent={(value: string): void => onChange("id", value)}
                            adornment={<AccountCircle/>}/>
            </ErrorLabel>
            <ErrorLabel error={errors.email}>
                <InputField label={"email"} value={state.email}
                            onChangeEvent={(value: string): void => onChange("email", value)}
                            adornment={<AccountCircle/>}/>
            </ErrorLabel>
            <ErrorLabel error={errors.captcha}>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <TextField
                        variant="filled"
                        label={"Captcha"}
                        value={state.captcha}
                        onChange={(event) => onChange("captcha", event.target.value)}
                    />
                    <div style={{width: 160, margin: "0px 8px"}}>
                        <DistortionText fontSize={30} text={captcha}/>
                    </div>
                    <IconButton onClick={() => setCaptcha(generateCaptcha())}>
                        <Refresh/>
                    </IconButton>
                </div>
            </ErrorLabel>
            <Button variant="contained" color="primary" onClick={() => onTrack()} style={{marginTop: 16}}>
                {loading ? <CircularProgress size={24}/> : "Track your order"}
            </Button>
            <Divider style={{marginTop: 16, width: "100%"}}/>
        </div>
    );

    return (
        <React.Fragment>
            <Meta page="track"/>
            <div className={classes.margin}
                 style={{
                     maxWidth: 600,
                     overflow: "hidden",
                     borderRadius: 6,
                     padding: 16, display: "flex", flexDirection: "column", alignItems: "flex-end",
                 }}
            >
                {renderSubmitForm()}
                {renderOrder()}
            </div>
        </React.Fragment>
    );
};

export default TrackOrder;
