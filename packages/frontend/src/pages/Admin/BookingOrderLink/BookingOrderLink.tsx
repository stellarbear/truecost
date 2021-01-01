import {gql, useMutation} from '@apollo/client';
import {Button, Container, Divider, Typography} from '@material-ui/core';
import {Currencies, validate} from '@truecost/shared';
import { frontend } from 'auxiliary/route';
import {ErrorBox} from 'components';
import {ControllerDropdownSelect, ControllerInput} from 'components/controller';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {useNotification} from 'components/wrappers/NotifyWrapper';
import {Col, Row} from 'pages/Base/Grid';
import {useStore} from 'pages/Data/Wrapper';
import * as React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {dataDefault, infoDefault, infoValidate, dataValidate} from './helpers';
import {IBookingForm} from './interfaces';


const MAKE_BOOKING = gql`
    mutation BookingCreateOrderLink($input: BookingOrderLinkInput!) {
        BookingCreateOrderLink(input: $input) 
    }
`;

type InputForm = IBookingForm;

export const BookingOrderLink: React.FC = () => {
    const {notify} = useNotification();
    const {setLoading} = useLoading();
    const [mutation, {data, error}] = useMutation(MAKE_BOOKING);

    const {subs} = useStore();

    React.useEffect(() => {
        if (data?.BookingCreateOrderLink) {
            const id = data.BookingCreateOrderLink;
            const link = `${frontend.uri}/checkout/direct/${id}`;
            console.log(link);
            notify(link);
        }
    }, [data]);

    const form = useForm<InputForm>({
        defaultValues: {
            data: dataDefault,
            info: infoDefault,
        },
    });
    const {control, errors, handleSubmit} = form;
    const SubscriptionOptions = React.useCallback(() =>
        Object.keys(subs).map((key) => ({
            id: subs[key].id, name: subs[key].description,
        })), [subs]);

    const CurrencyOptions = React.useCallback(() =>
        [Currencies.usd, Currencies.eur]
            .map(({id, label}) => ({id, name: label}),
        ), []);

    const onSubmit = React.useCallback(
        async (input: InputForm) => {
            try {
                setLoading(true);
                input.info = input.info.replace(/\s\s+/g, ' ');
                input.data = input.data.replace(/\s\s+/g, ' ');
                
                await mutation({variables: {input}});
            } catch (e) {
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return (
        <Container maxWidth="sm">
            <Col s={16}>
                <Typography variant="h6">
                    {`Создание прямого заказа`}
                </Typography>
                <Divider />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name={"email"}
                        control={control}
                        rules={{
                            required: "This field is required",
                            pattern: {
                                value: validate("email").regex,
                                message: "Does not look like email",
                            },
                        }}
                        render={({value, onChange}) => (
                            <ControllerInput
                                {...{value, onChange}}
                                label="Email *"
                                error={errors.email}
                            />
                        )}
                    />
                    <Row s={16}>
                        <Controller
                            name={"currency"}
                            control={control}
                            rules={{
                                validate: (value) => !!value ||
                                    "This field is required",
                            }}
                            render={({value, onChange}) => (
                                <ControllerDropdownSelect
                                    noDiscard
                                    {...{value, onChange}}
                                    label="Currency *"
                                    data={CurrencyOptions()}
                                    error={errors.currency}
                                />
                            )}
                        />
                        <Controller
                            name={"game"}
                            control={control}
                            rules={{
                                validate: (value) => !!value ||
                                    "This field is required",
                            }}
                            render={({value, onChange}) => (
                                <ControllerInput
                                    {...{value, onChange}}
                                    label="Game *"
                                    error={errors.game}
                                />
                            )}
                        />
                    </Row>
                    <Controller
                        name={"subscription"}
                        control={control}
                        render={({value, onChange}) => (
                            <ControllerDropdownSelect
                                {...{value, onChange}}
                                label="Subscription"
                                data={SubscriptionOptions()}
                                error={errors.subscription}
                            />
                        )}
                    />

                    <Divider style={{marginBottom: 32}} />

                    <Controller
                        name={"data"}
                        control={control}
                        rules={{
                            required: "This field is required",
                            validate: (value) => dataValidate(value) ||
                                "Invalid structure",
                        }}
                        render={({value, onChange}) => (
                            <ControllerInput
                                noDiscard
                                rows={14}
                                {...{value, onChange}}
                                label="Items *"
                                error={errors.data}
                            />
                        )}
                    />

                    <Controller
                        name={"info"}
                        control={control}
                        rules={{
                            validate: (value) => infoValidate(value) ||
                                "Invalid structure",
                        }}
                        render={({value, onChange}) => (
                            <ControllerInput
                                noDiscard
                                rows={6}
                                {...{value, onChange}}
                                label="Info"
                                error={errors.info}
                            />
                        )}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary">
                        {"Создать заказ"}
                    </Button>
                </form>
                <ErrorBox error={error} />
            </Col>
        </Container>
    );
};