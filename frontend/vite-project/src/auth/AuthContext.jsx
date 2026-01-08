import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../config/api";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMe = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("/auth/me");
                setUser(res.data.user);
            } catch (err) {
                console.error("Auth initialization failed", err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password });
            const { accessToken, refreshToken } = res.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // Get user data
            const meRes = await api.get("/auth/me");
            setUser(meRes.data.user);

            toast.success("Welcome back!");
            return meRes.data.user;
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Login failed";
            toast.error(errorMsg);
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const res = await api.post("/auth/register", userData);
            toast.success("Registration successful! Please login");
            return res.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Registration failed";
            toast.error(errorMsg);
            throw err;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await api.post("/auth/logout", { refreshToken });
            }
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
            toast.info("Logged out successfully");
        }
    };

    const value = {
        user,
        setUser,
        isAuthenticated: !!user,
        role: user?.role,
        login,
        register,
        logout,
        loading,
    };


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};
