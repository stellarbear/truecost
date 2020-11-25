import * as React from 'react';
import {gql, useLazyQuery} from '@apollo/client';
import {TextField, Button, CircularProgress, Typography, Box} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {useForm} from 'react-hook-form';
import {Col} from '../Grid';
import {validate} from '@truecost/shared';
import {Alert} from '@material-ui/lab';
import {parseApolloError} from 'auxiliary/error';
import {useModalToggle} from 'components/ModalDialog';
import {useNotification} from 'components/wrappers/NotifyWrapper';

const EMAIL_PROMO_CODE = gql`
    query EmailPromoCode($email: String!, $code: String!) {
        EmailPromoCode(email:$email, code:$code)
    }
`;

interface IProps {
    code: string;
}

interface InputForm {
    code: string;
    email: string;
}

export const EmailPromoDialog: React.FC<IProps> = (props) => {
    const {code} = props;
    const {current: {user}} = useStore();
    const {notify} = useNotification();
    const {toggle: close} = useModalToggle();

    const [query, {data, error, loading}] = useLazyQuery(EMAIL_PROMO_CODE);

    const form = useForm<InputForm>({
        reValidateMode: "onBlur",
        defaultValues: {email: user ? user.email : "", code},
    });
    const {register, handleSubmit, errors} = form;

    register("code", {});

    const onSubmit = async (data: InputForm) => {
        try {
            query({variables: data});
        } catch (e) { }
    };

    React.useEffect(() => {
        if (data && ("EmailPromoCode" in data)) {
            close();
            notify("We have sent a promo code. Check your email.");
        }
    }, [data]);

    return (
        <Col s={16}>
            <Typography variant="h6">
                Enter your email and we will
                send you a promotional code shortly
                </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Col s={8}>
                    <TextField
                        fullWidth
                        inputRef={register({
                            required: "This field is required",
                            pattern: {
                                value: validate("email").regex,
                                message: "Does not look like email (:",
                            },
                        })}
                        name={"email"}
                        label="Email *"
                        error={!!errors.email?.message}
                        helperText={errors.email?.message || " "}
                        variant="filled"
                    />
                    <Button type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        style={{height: 54}}>
                        {loading
                            ? <CircularProgress size={24} />
                            : <Typography
                                variant="button"
                                style={{whiteSpace: "pre"}}>{
                                    "Get promo code"
                                }</Typography>}
                    </Button>
                </Col>
            </form>
            <Box>
                {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
            </Box>
        </Col>
    );
};