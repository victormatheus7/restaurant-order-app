import axios from "axios";

class OrderService {
    async getOrders() {
        return await axios.get('http://localhost:5001/api/v1.0/orders');
    }

    async getOrder(id) {
        return await axios.get(`http://localhost:5001/api/v1.0/orders/${id}`);
    }

    async addOrder(orderRequest) {
        return await axios({
            method: 'post',
            url: 'http://localhost:5001/api/v1.0/orders',
            data: orderRequest
        });
    }

    _timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }
}

const orderService = new OrderService();
export default orderService;