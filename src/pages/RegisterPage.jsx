import React, { useState } from 'react';
import { Phone, Lock, User, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../assets/bg.webp';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        shopName: '',
        ownerName: '',
        phone: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // මෙතනට ඔයාගේ Railway/Vercel Backend URL එක දාන්න
            const res = await axios.post("https://ඔයාගේ-backend-url.railway.app/register-shop", formData);
            alert("නියමයි! ලියාපදිංචිය සාර්ථකයි. 🎉");
            navigate('/'); 
        } catch (err) {
            alert(err.response?.data?.message || "ලියාපදිංචිය අසාර්ථකයි. නැවත උත්සාහ කරන්න.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${bgImage})`, backgroundAttachment: 'fixed' }}>
            
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px]"></div>
            
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/30 backdrop-blur-xl py-10 px-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-[45px] border border-white/40 overflow-hidden">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-700/20 rounded-2xl mb-4">
                            <ShieldCheck className="h-10 w-10 text-blue-700" />
                        </div>
                        <h2 className="text-3xl font-black text-blue-950 tracking-tight mb-1">ගිණුමක් අරඹන්න</h2>
                        <p className="text-blue-900 font-bold text-sm opacity-80 uppercase tracking-widest">Join Smart Shop Keeper</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        {/* Shop Name */}
                        <div className="relative group">
                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-800 transition-colors group-focus-within:text-blue-600" />
                            <input 
                                required
                                type="text" 
                                placeholder="කඩේ නම (Shop Name)" 
                                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-blue-950 placeholder:text-blue-900/50"
                                onChange={(e) => setFormData({...formData, shopName: e.target.value})} 
                            />
                        </div>

                        {/* Owner Name */}
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-800 transition-colors group-focus-within:text-blue-600" />
                            <input 
                                required
                                type="text" 
                                placeholder="ඔබේ නම (Owner Name)" 
                                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-blue-950 placeholder:text-blue-900/50"
                                onChange={(e) => setFormData({...formData, ownerName: e.target.value})} 
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-800 transition-colors group-focus-within:text-blue-600" />
                            <input 
                                required
                                type="tel" 
                                placeholder="දුරකථන අංකය" 
                                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-blue-950 placeholder:text-blue-900/50"
                                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                            />
                        </div>

                        {/* Password */}
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-800 transition-colors group-focus-within:text-blue-600" />
                            <input 
                                required
                                type="password" 
                                placeholder="මුරපදය (Password)" 
                                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-blue-950 placeholder:text-blue-900/50"
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-lg font-black shadow-[0_10px_20px_-10px_rgba(29,78,216,0.5)] active:scale-[0.98] transition-all flex items-center justify-center group"
                        >
                            {loading ? "ලියාපදිංචි වෙමින්..." : (
                                <>
                                    ලියාපදිංචි වන්න <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-8 text-center border-t border-white/20 pt-6">
                        <p className="text-blue-950 font-bold mb-2">දැනටමත් ගිණුමක් තිබේද?</p>
                        <button 
                            onClick={() => navigate('/')} 
                            className="text-blue-700 font-black text-lg hover:underline underline-offset-4"
                        >
                            ඇතුළු වන්න (Login)
                        </button>
                    </div>
                </div>

                {/* Copyright */}
                <p className="text-center mt-6 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    © 2026 Smart Shop Keeper • All Rights Reserved
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;