import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Box, Button, CircularProgress, Paper, TextField} from '@material-ui/core';
import {Col} from 'pages/Base/Grid';
import {Alert} from '@material-ui/lab';
import {parseApolloError} from 'auxiliary/error';
import {useNotification} from 'components/wrappers/NotifyWrapper';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {useForm} from 'react-hook-form';
import {Dict} from '@truecost/shared';
import {gql, useMutation} from '@apollo/client';

const USER_UPDATE_INFO = gql`
    mutation UserUpdateInfo ($oldPassword: String!, $newPassword: String, $name: String) {
        UserUpdateInfo(oldPassword: $oldPassword, newPassword: $newPassword, name: $name) {
            name
            role
            email
            id
        }
    }
`;

interface ISubmit {
    oldPassword: string;
    newPassword?: string;
    name?: string;
}

interface IProps {
    onUpdate: () => void;
}

export const AccountUpdate: React.FC<IProps> = ({onUpdate}) => {
    const {setLoading} = useLoading();
    const {update: {setUser}} = useStore();
    const {notify} = useNotification();
    const [mutation, {data, error, loading}] = useMutation(USER_UPDATE_INFO);

    const {register, handleSubmit, errors, clearErrors} = useForm<ISubmit>({reValidateMode: "onBlur"});

    const onSubmit = React.useCallback(
        async (data: ISubmit) => {
            try {
                clearErrors();
                setLoading(true);

                const variables: Dict<string> = {};
                for (const [key, value] of Object.entries(data)) {
                    if (value.length > 0) {
                        variables[key] = value;
                    }
                }

                await mutation({variables});
            } catch (e) {
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    React.useEffect(() => {
        if (data?.UserUpdateInfo) {
            if (data.UserUpdateInfo) {
                setUser(data.UserUpdateInfo);
                notify("account info updated");
                onUpdate();
            }
        }
    }, [data?.UserUpdateInfo]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Paper>
                <Col fullWidth p={16}>
                    <TextField
                        fullWidth
                        inputRef={register()}
                        name={"name"}
                        label="Username"
                        placeholder="leave empty if no changes"
                        error={!!errors.name?.message}
                        helperText={errors.name?.message || " "}
                        variant="filled"
                    />
                    <TextField
                        fullWidth
                        inputRef={register()}
                        name={"newPassword"}
                        label="New password"
                        placeholder="leave empty if no changes"
                        error={!!errors.newPassword?.message}
                        helperText={errors.newPassword?.message || " "}
                        variant="filled"
                    />
                    <TextField
                        fullWidth
                        inputRef={register({
                            required: "This field is required",
                        })}
                        name={"oldPassword"}
                        label="Old password *"
                        placeholder="leave empty if no changes"
                        error={!!errors.oldPassword?.message}
                        helperText={errors.oldPassword?.message || " "}
                        variant="filled"
                    />
                    <Button fullWidth variant="contained" type="submit">
                        {loading ? <CircularProgress size={24}/> : "update info"}
                    </Button>
                </Col>
            </Paper>
            <Box mt={2}>
                {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
            </Box>
        </form>
    );
};
