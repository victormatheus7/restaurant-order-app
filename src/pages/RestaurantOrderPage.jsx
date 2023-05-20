import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Orders from '../components/restaurantOrderPage/Orders';
import Copyright from '../components/shared/Copyright';
import OrderService from '../service/OrderService';

export default function RestaurantOrderPage() {
    const [persistedOrders, setPersistedOrders] = useState([]);

    useEffect(() => {
        (async () => {
            setPersistedOrders((await OrderService.getOrders()).data);
        })();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const orderInfo = data.get('order').split(',').map(s => s.trim().toLowerCase());
        const timeOfDayName = orderInfo.shift();

        if ((timeOfDayName !== 'morning' && timeOfDayName !== 'night') || !orderInfo.every(s => /^\d+$/.test(s)))
            return;

        const orderRequest = {
            id: uuidv4(),
            timeOfDayName: timeOfDayName,
            dishTypeIds: orderInfo.map(Number)
        };

        await OrderService.addOrder(orderRequest);
        const persistedOrder = (await OrderService.getOrder(orderRequest.id)).data;

        setPersistedOrders(persistedOrder.concat(persistedOrders));
    };

    return (
        <Container component="main">
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <Typography component="h1" variant="h5">
                    Place your order
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="order"
                        label="Order"
                        name="order"
                        autoFocus
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Send Order
                    </Button>
                </Box>
            </Box>
            <Orders rows={ persistedOrders } />
            <Copyright sx={{ mt: 4, mb: 4 }} />
        </Container>
    );
}