import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../constants';

// Internal Helper for Icon
const WarningIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
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
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
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
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: formData.email,
                password: formData.password
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
                setErrors({ general: response.data.message || 'Login failed' });
            }
        } catch (err: any) {
            setErrors({ general: err.response?.data?.message || 'Invalid credentials or server error.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-primary">
            {/* Left Side: Branding & Info */}
            <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[#F37021]/10 backdrop-blur-[100px] z-10"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F37021] rounded-full blur-[150px] opacity-20"></div>

                <div className="relative z-20 w-full p-20 flex flex-col justify-between">
                    <div>
                        <img
                            src="https://ranksol.com/wp-content/uploads/2020/10/ranksol-logo1-1.png"
                            alt="RankSol"
                            className="h-16 w-auto mb-12"
                        />
                        <h1 className="text-4xl font-black text-white leading-tight mb-6">
                            Visualize your <br />
                            <span className="text-[#F37021]">Interior Dreams</span> <br />
                            with AI.
                        </h1>
                        <p className="text-xl text-gray-400 max-w-md font-medium">
                            RankSol AI Design Studio helps you reimagine any space with cutting-edge artificial intelligence.
                        </p>
                    </div>

                    <div className="mt-10 bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-md">
                        <p className="text-white font-medium text-lg  italic">
                            "The easiest way to transform your home. Just upload, click, and be wowed."
                        </p>
                        {/* <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F37021] to-orange-400"></div>
                            <div>
                                <p className="text-white font-bold">Muhammad Awais</p>
                                <p className="text-gray-500 text-sm">Lead Designer, RankSol</p>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
                <div className="w-full max-w-md animate-in slide-in-from-right-10 duration-700">
                    <div className="mb-12">
                        <Link to="/" className="lg:hidden block mb-8">
                            <img
                                src="https://ranksol.com/wp-content/uploads/2020/10/ranksol-logo1-1.png"
                                alt="RankSol"
                                className="h-8 w-auto"
                            />
                        </Link>
                        <h2 className="text-4xl font-black text-black mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
                                <WarningIcon />
                                {errors.general}
                            </div>
                        )}

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

                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#F37021] focus:ring-[#F37021]" />
                                <label htmlFor="remember" className="text-sm font-bold text-gray-600 cursor-pointer">Remember me</label>
                            </div>
                            <Link to="/forgot" className="text-sm font-bold text-[#F37021] hover:underline">Forgot password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-5 rounded-[20px] font-black text-lg hover:bg-[#F37021] transform active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <HiOutlineArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 font-medium">
                            First time here?
                            <Link to="/register" className="text-[#F37021] font-black ml-2 hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;