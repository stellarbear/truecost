import {Button, Container, Divider, Typography} from '@material-ui/core';
import {Currencies, validate} from '@truecost/shared';
import {ControllerDropdownSelect, ControllerInput, ControllerNumber} from 'components/controller';
import {Col, Row} from 'pages/Base/Grid';
import {useStore} from 'pages/Data/Wrapper';
import * as React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {dataDefault, infoDefault, infoValidate, dataValidate, parseOrder} from './helpers';
import {IOrderForm, IOrderData} from './interfaces';


interface IProps {
    order?: IOrderData;
}

type InputForm = IOrderForm;

export const OrderUpsertForm: React.FC<IProps> = (props) => {
    const {order} = props;
    const flattenedOrder = parseOrder(order);
    const newOrder = !!order;

    const {subs, games} = useStore();

    const form = useForm<InputForm>({
        defaultValues: {
            ...flattenedOrder,
            data: dataDefault,
            info: infoDefault,
            total: 1,
        },
    });
    const {register, control, errors, handleSubmit} = form;

    const SubscriptionOptions = React.useCallback(() =>
        Object.keys(subs).map((key) => ({
            id: subs[key].name, name: subs[key].description,
        })), [subs]);

    const CurrencyOptions = React.useCallback(() =>
        [Currencies.usd, Currencies.eur]
            .map(({id, label}) => ({id, name: label}),
            ), []);

    const GameOptions = React.useCallback(() =>
        Object.keys(games.id).map((key) => ({
            id: games.id[key].name, name: games.id[key].url,
        })), [games.id]);


    register("id", {});

    const onSubmit = React.useCallback(
        async (input: InputForm) => {
            input.info = input.info.replace(/\s\s+/g, ' ');
            input.data = input.data.replace(/\s\s+/g, ' ');
            console.log(input);
        },
        [],
    );

    return (
        <Container maxWidth="sm">
            <Col s={16}>
                <Typography variant="h6">
                    {order
                        ? `Редактирование заказа`
                        : 'Новый заказ'}
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
                                <ControllerDropdownSelect
                                    noDiscard
                                    {...{value, onChange}}
                                    label="Game *"
                                    data={GameOptions()}
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

                    <Row s={16}>
                        <Controller
                            name={"pi"}
                            control={control}
                            rules={{
                                required: "This field is required",
                            }}
                            render={({value, onChange}) => (
                                <ControllerInput
                                    noDiscard
                                    {...{value, onChange}}
                                    label="Transaction ID *"
                                    error={errors.pi}
                                />
                            )}
                        />
                        <Controller
                            name={"total"}
                            control={control}
                            rules={{
                                required: "This field is required",
                                validate: (v) => v > 0 || "Must be > 0",
                            }}
                            render={({value, onChange}) => (
                                <ControllerNumber
                                    noDiscard
                                    {...{value, onChange}}
                                    label="Price *"
                                    error={errors.total}
                                />
                            )}
                        />
                    </Row>
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
                        {order ? "Обновить заказ" : "Создать заказ"}
                    </Button>
                </form>
            </Col>
        </Container>
    );
};