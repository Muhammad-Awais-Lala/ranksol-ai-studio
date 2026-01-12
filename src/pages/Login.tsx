import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
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
    };

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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

        // Simulate API call - User will integrate real API later
        setTimeout(() => {
            try {
                // Mock successful login
                login('mock_token_' + Math.random(), {
                    id: '1',
                    name: formData.email.split('@')[0],
                    email: formData.email
                });
                setIsLoading(false);
                navigate('/');
            } catch (err) {
                console.error('Login error:', err);
                setErrors({ email: 'Login failed. Please try again.' });
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
            {/* Main Container */}
            <div className="relative w-full max-w-sm">
                {/* Combined Yellow Header and Login Card */}
                <div className="rounded-xl shadow-xl overflow-hidden border border-gray-300">
                    {/* Yellow Header - Pure #EFE223 */}
                    <div className="bg-[#EFE223] p-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                            {/* KMI Logo - Smaller */}
                            <div className="mb-2">
                                <img
                                    src="https://kmigroups.com/images/logo.webp"
                                    alt="KMI Logo"
                                    className="h-10 w-auto object-contain"
                                />
                            </div>
                            <h1 className="text-lg font-bold text-black">KMI AI Design Studio</h1>
                            {/* <p className="text-black/90 text-xs mt-0.5">Project Portal</p> */}
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white p-4">
                        <form onSubmit={handleSubmit} className="space-y-3">
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
                                        className={`w-full pl-8 p-2 text-sm border rounded-md focus:outline-none focus:border-[#EFE223] focus:ring-1 focus:ring-[#EFE223] ${errors.email ? 'border-red-500' : 'border-gray-300'
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
                                        className={`w-full pl-8 pr-10 p-2 text-sm border rounded-md focus:outline-none focus:border-[#EFE223] focus:ring-1 focus:ring-[#EFE223] ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your password"
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


                            {/* Login Button */}
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
                                        <span>Logging in...</span>
                                    </div>
                                ) : (
                                    'LOGIN'
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-xs">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-black hover:text-black font-medium flex items-center justify-center gap-1">
                                    <FaUserPlus />
                                    <span>Sign up</span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;