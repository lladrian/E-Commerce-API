import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';


export const loginUser = async (userData) => {
    try {
        const res = await axios.post(`${API_BASE}/users/login_user`, userData);

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

export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${API_BASE}/users/get_all_user`);
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


export const updateUser = async (id, userData) => {
    try {
        const res = await axios.put(`${API_BASE}/users/update_user/${id}`, userData);
        
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



export const createUser = async (userData) => {
    try {
        const res = await axios.post(`${API_BASE}/users/add_user`, userData);
        
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

export const deleteUser = async (id) => {
    try {
        const res = await axios.delete(`${API_BASE}/users/delete_user/${id}`);
        
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



