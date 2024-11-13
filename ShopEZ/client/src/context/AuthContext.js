import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode'; // Ensure this import is correct

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Loading starts as true
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const navigate = useNavigate();

    // Move the logout function above useEffect and wrap it in useCallback
    const logout = useCallback(() => {
        sessionStorage.clear();
        sessionStorage.removeItem('token');
        setCartCount(0);
        setUser(null);
        setIsAuthenticated(false);
        navigate('/');
    }, [navigate]); // Adding navigate as a dependency since it is used inside logout

    // Check for token in local storage to maintain session on refresh
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwt_decode(token);
                setUser(decoded);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Token decoding failed:", error);
                logout(); // Logout to remove invalid token
            }
        }
        setLoading(false); // Set loading to false once check is complete
    }, [logout]); // Add logout as a dependency in useEffect

    useEffect(() => {
        fetchCartCount();
    }, []);

    const fetchCartCount = async () => {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            try {
                const response = await axios.get('http://localhost:3001/api/cart/fetch-cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCartCount(response.data.filter(item => item.userId === userId).length);
            } catch (error) {
                console.error("Failed to fetch cart count:", error);
            }
        }
    };

    const updateCartCount = () => {
        fetchCartCount();
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/api/users/login', { email, password });
            const token = response.data.token;
            console.log('login response', response);

            if (token) {
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('userId', response.data.user._id);
                sessionStorage.setItem('userType', response.data.user.usertype);
                sessionStorage.setItem('username', response.data.user.username);
                sessionStorage.setItem('email', response.data.user.email);
                const decoded = jwt_decode(token);

                console.log("Decoded token:", decoded);
                // Check if usertype exists in the decoded token
                if (decoded.usertype) {
                    setUser(decoded);
                    setIsAuthenticated(true);
                } else {
                    throw new Error("Invalid token payload: usertype is missing");
                }
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            logout(); // Ensure any partially set state is reset
            throw new Error(error.response?.data?.message || "Login failed"); // Rethrow for caller
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, cartCount, updateCartCount }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
