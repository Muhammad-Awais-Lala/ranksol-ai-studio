import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../constants';

const WarningIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
                setErrors({ general: response.data.message || 'Signup failed' });
            }
        } catch (err: any) {
            setErrors({ general: err.response?.data?.message || 'Registration failed.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-primary">
            {/* Left Side: Branding & Info */}
            <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[#F37021]/10 backdrop-blur-[100px] z-10"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F37021] rounded-full blur-[150px] opacity-20"></div>

                <div className="relative z-20 w-full p-20 flex flex-col justify-between">
                    <div>
                        <img
                            src="https://ranksol.com/wp-content/uploads/2023/10/ranksol-logo.png"
                            alt="RankSol"
                            className="h-10 w-auto mb-12"
                        />
                        <h1 className="text-6xl font-black text-white leading-tight mb-6">
                            Start Your <br />
                            <span className="text-[#F37021]">Creative Journey</span> <br />
                            Today.
                        </h1>
                        <p className="text-xl text-gray-400 max-w-md font-medium">
                            Join thousands of designers using RankSol AI to bring their interior design visions to life.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-md">
                        <div className="flex gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#F37021] font-bold">10k+</div>
                            <p className="text-white/60 text-sm font-medium">Active users designing their spaces daily using our AI engine.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50 overflow-y-auto">
                <div className="w-full max-w-md my-12 animate-in slide-in-from-left-10 duration-700">
                    <div className="mb-10">
                        <Link to="/" className="lg:hidden block mb-8">
                            <img
                                src="https://ranksoltools.com/assets/img/logo.png"
                                alt="RankSol"
                                className="h-8 w-auto"
                            />
                        </Link>
                        <h2 className="text-4xl font-black text-black mb-2 tracking-tight">Create Account</h2>
                        <p className="text-gray-500 font-medium">Join us and start designing with AI.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errors.general && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
                                <WarningIcon />
                                {errors.general}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <div className="relative group">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F37021] transition-colors" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-[#F37021] outline-none transition-all"
                                />
                            </div>
                            {errors.username && <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F37021] transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@company.com"
                                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-[#F37021] outline-none transition-all"
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F37021] transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:border-[#F37021] outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F37021] transition-colors" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-[#F37021] outline-none transition-all"
                                />
                            </div>
                            {errors.confirmPassword && <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-5 rounded-[20px] font-black text-lg hover:bg-[#F37021] transform active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <HiOutlineArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 font-medium">
                            Already part of the community?
                            <Link to="/login" className="text-[#F37021] font-black ml-2 hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;