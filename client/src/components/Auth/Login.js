import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import "../../styles/Auth/Login.css";

const Login = ({ onSuccess }) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [emailExists, setEmailExists] = useState(false);
    const [emailError, setEmailError] = useState(""); // New state for email error
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:3001/api/users/login", formData);
            const token = response.data.token;
            const userType = response.data.user.usertype;

            if (token) {
                sessionStorage.setItem("token", token);
                await login(formData.email, formData.password);
                alert("Login Successful");
                navigate(userType === "admin" ? "/admin" : "/profile", { replace: true });
            } else {
                throw new Error("Token not received");
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordClick = () => {
        setResetModalOpen(true);
        setEmailExists(false);
        setEmailError("");
        setResetEmail("");
        setNewPassword("");
    };

    const checkEmailExists = async () => {
        if (!resetEmail) {
            setEmailError("Please enter an email.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/api/forgot/forgot-password", { email: resetEmail });
            if (response.status === 200) {
                setEmailExists(true);
                setEmailError(""); // Clear error on success
            }
        } catch (error) {
            alert("User with this email not found. Redirecting to Sign Up.");
            navigate("/register");
        }
    };

    const handlePasswordReset = async () => {
        try {
            const response = await axios.post("http://localhost:3001/api/forgot/reset-password", {
                email: resetEmail,
                newPassword: newPassword
            });
            if (response.status === 200) {
                alert("Password has been reset successfully.");
                setResetModalOpen(false);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to reset password.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-section">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <div className="form-footer">
                        <span
                            onClick={handleForgotPasswordClick}
                            className="forgot-password-text"
                        >
                            Forgot Password?
                        </span>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <hr />
                <p className="sign-up-link">
                    Don't have an account? <a href="/register">Sign up here</a>
                </p>
            </div>

            {/* Password Reset Modal */}
            {resetModalOpen && (
                <div className="pass-reset">
                    <div className="pass-reset-content">
                        <h3>Reset Password</h3>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={resetEmail}
                            onChange={(e) => {
                                setResetEmail(e.target.value);
                                setEmailError(""); // Clear error on email change
                            }}
                            required
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                        {emailExists && (
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        )}
                        {!emailExists ? (
                            <button onClick={checkEmailExists}>Verify Email</button>
                        ) : (
                            <button onClick={handlePasswordReset}>Reset Password</button>
                        )}
                        <button onClick={() => setResetModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
