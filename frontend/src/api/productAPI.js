import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';




export const getAllProducts = async () => {
    try {
        const res = await axios.get(`${API_BASE}/products/get_all_product`);
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

export const getSpecificProduct = async (id) => {
    try {
        const res = await axios.get(`${API_BASE}/products/get_specific_product/${id}`);
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
export const updateProduct = async (id, productData) => {
    try {
        const res = await axios.put(`${API_BASE}/products/update_product/${id}`, productData);
        
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


export const createProduct = async (productData) => {
    try {
        const res = await axios.post(`${API_BASE}/products/add_product`, productData);
        
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


export const deleteProduct = async (id) => {
    try {
        const res = await axios.delete(`${API_BASE}/products/delete_product/${id}`);
        
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



