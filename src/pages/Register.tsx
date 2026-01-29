import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../constants';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<{
        email?: string;
        username?: string;
        password?: string;
        confirmPassword?: string;
        general?: string;
    }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_ ]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, spaces, and underscores';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/signup`, {
                name: formData.username,
                email: formData.email,
                password: formData.password,
                c_password: formData.confirmPassword
            });

            if (response.data.status) {
                const { token, user } = response.data.data;
                login(token, {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email
                });
                navigate('/');
            } else {
                // Handle 200 OK but status false (custom error response)
                const responseData = response.data;
                if (responseData.errors) {
                    const newServerErrors: typeof errors = {};
                    if (responseData.errors.email) newServerErrors.email = responseData.errors.email[0];
                    if (responseData.errors.username) newServerErrors.username = responseData.errors.username[0];
                    if (responseData.errors.password) newServerErrors.password = responseData.errors.password[0];

                    // If the user meant the "message box" (general error div) specifically for the email error:
                    let generalMsg = responseData.message || 'Validation failed';
                    if (responseData.errors.email) {
                        generalMsg = responseData.errors.email[0];
                    }

                    setErrors({
                        ...newServerErrors,
                        general: generalMsg
                    });
                } else {
                    setErrors({ general: responseData.message || 'Signup failed' });
                }
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            const responseData = err.response?.data;

            if (responseData?.errors) {
                const newServerErrors: typeof errors = {};
                if (responseData.errors.email) newServerErrors.email = responseData.errors.email[0];
                if (responseData.errors.username) newServerErrors.username = responseData.errors.username[0];
                if (responseData.errors.password) newServerErrors.password = responseData.errors.password[0];

                // Prioritize showing the email error in the general box if present, as requested
                let generalMsg = responseData.message || 'Validation error';
                if (responseData.errors.email) {
                    generalMsg = responseData.errors.email[0];
                }

                setErrors({
                    ...newServerErrors,
                    general: generalMsg
                });
            } else {
                const errorMessage = responseData?.message || 'An error occurred during signup. Please try again.';
                setErrors({ general: errorMessage });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
            {/* Main Container */}
            <div className="relative w-full max-w-sm">
                {/* Combined Yellow Header and Signup Card */}
                <div className="rounded-xl shadow-xl overflow-hidden border border-gray-300">
                    {/* Yellow Header - Pure #EFE223 with Logo */}
                    <div className="bg-[#EFE223] p-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                            {/* KMI Logo - Same size as login page */}
                            <div className="mb-2">
                                <img
                                    src="https://kmigroups.com/images/logo.webp"
                                    alt="KMI Logo"
                                    className="h-10 w-auto object-contain"
                                />
                            </div>
                            <h1 className="text-lg font-bold text-black">KMI AI Design Studio</h1>
                        </div>
                    </div>

                    {/* Signup Form */}
                    <div className="bg-white p-4">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* General Error Message */}
                            {errors.general && (
                                <div className="p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
                                    {errors.general}
                                </div>
                            )}



                            {/* Username Field */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute left-2.5 top-2.5 text-gray-400 text-sm">
                                        <FaUser />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`w-full pl-8 p-2 text-sm text-black bg-white border rounded-md focus:outline-none focus:border-[#EFE223] focus:ring-1 focus:ring-[#EFE223] ${errors.username ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Choose a username"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-0.5 text-xs text-red-600">{errors.username}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-2.5 top-2.5 text-gray-400 text-sm">
                                        <FaEnvelope />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-8 p-2 text-sm text-black bg-white border rounded-md focus:outline-none focus:border-[#EFE223] focus:ring-1 focus:ring-[#EFE223] ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-2.5 top-2.5 text-gray-400 text-sm">
                                        <FaLock />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full pl-8 pr-10 p-2 text-sm text-black bg-white border rounded-md focus:outline-none focus:border-[#EFE223] focus:ring-1 focus:ring-[#EFE223] ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2.5 top-2.5 text-gray-500 hover:text-black text-sm"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-0.5 text-xs text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-2.5 top-2.5 text-gray-400 text-sm">
                                        <FaLock />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-8 pr-10 p-2 text-sm text-black bg-white border rounded-md focus:outline-none focus:border-[#EFE223] focus:ring-1 focus:ring-[#EFE223] ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-2.5 top-2.5 text-gray-500 hover:text-black text-sm"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-0.5 text-xs text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>



                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2.5 px-4 rounded-md font-bold text-sm text-black transition-colors ${isLoading
                                    ? 'bg-[#EFE223] cursor-not-allowed'
                                    : 'bg-[#EFE223] hover:bg-[#EFE223]'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    'SIGN UP'
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-xs text-center flex flex-col items-center gap-1">
                                Already have an account?{' '}
                                <Link to="/login" className="text-black hover:text-black font-large flex items-center justify-center gap-1">
                                    <FaArrowLeft />
                                    <span>Back to Login</span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;