import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';


export const loginAdmin = async (adminData) => {
    try {
        const res = await axios.post(`${API_BASE}/admins/login_admin`, adminData);

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

export const getAdminStats = async () => {
    try {
        const res = await axios.get(`${API_BASE}/admins/get_admin_stats`);
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

export const getAllAdmins = async () => {
    try {
        const res = await axios.get(`${API_BASE}/admins/get_all_admin`);
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

export const createAdmin = async (adminData) => {
    try {
        const res = await axios.post(`${API_BASE}/admins/add_admin`, adminData);
        
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

export const deleteAdmin = async (id) => {
    try {
        const res = await axios.delete(`${API_BASE}/admins/delete_admin/${id}`);
        
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


export const updateAdmin = async (id, adminData) => {
    try {
        const res = await axios.put(`${API_BASE}/admins/update_admin/${id}`, adminData);
        
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



