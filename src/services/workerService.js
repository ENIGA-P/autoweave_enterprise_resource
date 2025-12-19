import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workers';

const getWorkers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const createWorker = async (workerData) => {
    const response = await axios.post(API_URL, workerData);
    return response.data;
};

const addShift = async (workerId, shiftData = {}) => {
    const response = await axios.post(`${API_URL}/${workerId}/shifts`, shiftData);
    return response.data;
};

const deleteWorker = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

const deleteShift = async (workerId, shiftId) => {
    const response = await axios.delete(`${API_URL}/${workerId}/shifts/${shiftId}`);
    return response.data;
};

const payWorker = async (workerId) => {
    const response = await axios.post(`${API_URL}/${workerId}/pay`);
    return response.data;
};

export default {
    getWorkers,
    createWorker,
    addShift,
    deleteWorker,
    deleteShift,
    payWorker,
    createOrder: async (workerId) => {
        const response = await axios.post(`${API_URL}/${workerId}/create-order`);
        return response.data;
    },
    verifyPayment: async (workerId, paymentData) => {
        const response = await axios.post(`${API_URL}/${workerId}/verify-payment`, paymentData);
        return response.data;
    }
};
