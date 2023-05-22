import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, TextField, Box, Typography, Container, Snackbar, Alert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Orders from '../components/restaurantOrderPage/Orders';
import Copyright from '../components/shared/Copyright';
import orderService from '../service/OrderService';

export default function RestaurantOrderPage() {
    const [persistedOrders, setPersistedOrders] = useState([]);
    const [showAlert, setShowAlert] = useState();
    const [timeoutId, setTimeoutId] = useState();
    const [invalidInput, setInvalidInput] = useState();

    useEffect(() => {
        (async () => {
            setPersistedOrders((await orderService.getOrders()).data);
        })();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const orderInfo = data.get('order').split(',').map(s => s.trim().toLowerCase());
        const timeOfDayName = orderInfo.shift();

        if (timeoutId) 
            clearTimeout(timeoutId);
        
        if ((timeOfDayName !== 'morning' && timeOfDayName !== 'night') || !orderInfo.every(s => /^\d+$/.test(s))) {     
            setInvalidInput(true);      
            setShowAlert(true);
            setTimeoutId(setTimeout(() => setShowAlert(false), 5000));
            return;
        }
        else {
            setInvalidInput(false)
            setShowAlert(false);
        }

        const orderRequest = {
            id: uuidv4(),
            timeOfDayName: timeOfDayName,
            dishTypeIds: orderInfo.map(Number)
        };

        await orderService.addOrder(orderRequest);
        const persistedOrder = (await orderService.getOrder(orderRequest.id)).data;

        setPersistedOrders(persistedOrder.concat(persistedOrders));
    };

    return (
        <>
            <Snackbar open={showAlert} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    Invalid input!
                </Alert>
            </Snackbar>
            <Container component="main">
                <Typography variant="h3" sx={{ mt: 4 }} align="center">
                    Restaurant Order App
                </Typography>
                <Box
                sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                    <Box
                    sx={{
                        mb: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                        <Typography variant="body2" align="justify">
                            Type your orders in the textbox below and hit "Send Order".
                        </Typography>
                        <Typography variant="body2" align="justify">
                            You must enter time of day as “morning” or “night” and you must enter a comma delimited list of dish types with at least one selection.
                        </Typography>
                        <Typography variant="body2" align="justify">
                            E.g.: morning, 1, 2, 3
                        </Typography>
                    </Box>
                    <Typography variant="h5">
                        Place your order
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate >
                        <TextField
                            error={ invalidInput }
                            onChange={() => setInvalidInput(false)}
                            margin="normal"
                            required
                            fullWidth
                            id="order"
                            name="order"
                            autoFocus
                            helperText={ invalidInput && "Invalid input." }
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2 }}
                        >
                            Send Order
                        </Button>
                    </Box>
                </Box>
                { (persistedOrders && persistedOrders.length > 0) && <Orders rows={ persistedOrders } sx={{ mt: 6 }} /> }
                <Copyright sx={{ mt: 4, mb: 4 }} />
            </Container>
        </>
    );
}