import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';



export const checkout = async (array_cart, cart_id) => {
    try {
        const res = await axios.post(`${API_BASE}/payments/checkout`, {
        array_cart,
        cart_id,
        });

        return {
            success: true,
            data: res?.data || [],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};
