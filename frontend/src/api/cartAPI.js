import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';


export const getAllOrderedCart = async () => {
    try {
        const res = await axios.get(`${API_BASE}/carts/get_all_ordered_cart`);
        return {
            success: true,
            data: res?.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};


export const getAllOrderedCartSpecificUser = async (user_id) => {
    try {
        const res = await axios.get(`${API_BASE}/carts/get_all_ordered_cart_specific_user/${user_id}`);
        return {
            success: true,
            data: res?.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};


export const getAllCartSpecificUser = async (user_id) => {
    try {
        const res = await axios.get(`${API_BASE}/carts/get_all_cart_specific_user/${user_id}`);
        return {
            success: true,
            data: res?.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};

export const getSpecificCart = async (id) => {
    try {
        const res = await axios.get(`${API_BASE}/carts/get_specific_cart/${id}`);
        return {
            success: true,
            data: res?.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};

export const createCart = async (cartData) => {
    try {
        const res = await axios.post(`${API_BASE}/carts/add_cart`, cartData);
        
        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};

export const removeCartItem = async (cartData) => {
    try {
        const res = await axios.post(`${API_BASE}/carts/remove_cart_item`, cartData);
        
        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};


export const removeCart = async (id) => {
    try {
        const res = await axios.delete(`${API_BASE}/carts/delete_cart/${id}`);
        
        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};


export const updateCart = async (cartData) => {
    try {
        const res = await axios.put(`${API_BASE}/carts/update_cart`, cartData);
        
        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};





