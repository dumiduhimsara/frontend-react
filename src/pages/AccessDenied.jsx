import React from 'react';
import { ShieldAlert, PhoneCall, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = ({ message, type }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-left">
            <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-blue-100">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 ${type === 'expired' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                    <ShieldAlert size={40} />
                </div>

                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-tight mb-4">
                    {type === 'expired' ? 'සේවා කාලය අවසන් වී ඇත' : 'ගිණුම අත්හිටුවා ඇත'}
                </h2>

                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    {message || "ඔබේ පද්ධතිය දිගටම පවත්වාගෙන යාම සඳහා කරුණාකර ගෙවීම් සිදුකර සේවාව අලුත් කරගන්න."}
                </p>

                <div className="space-y-4">
                    {/* Admin Contact Button */}
                    <a 
                        href="tel:0763896121" // ✅ මෙතනට ඔයාගේ නම්බර් එක දාන්න
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-center flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
                    >
                        <PhoneCall size={20} /> සහාය ලබාගන්න
                    </a>

                    <button 
                        onClick={handleLogout}
                        className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                    >
                        <LogOut size={20} /> ඉවත් වන්න
                    </button>
                </div>

                <p className="mt-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    SSK Manager • Professional Edition
                </p>
            </div>
        </div>
    );
};

export default AccessDenied;