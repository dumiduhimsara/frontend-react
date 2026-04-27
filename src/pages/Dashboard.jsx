import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const merchantName = localStorage.getItem("merchantName") || "මුදලාලි";
    const shopName = localStorage.getItem("shopName") || "Smart Shop";

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-950 text-white flex flex-col hidden md:flex">
                <div className="p-6">
                    <h1 className="text-xl font-black tracking-tighter text-blue-400 uppercase">
                        SSK Manager
                    </h1>
                    <p className="text-[10px] text-blue-300/50 font-bold uppercase tracking-widest mt-1">
                        Professional Edition
                    </p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
                    <NavItem icon={<Users size={20}/>} label="Customers" />
                    <NavItem icon={<Package size={20}/>} label="Products" />
                    <NavItem icon={<ShoppingCart size={20}/>} label="Orders" />
                    <NavItem icon={<Settings size={20}/>} label="Settings" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-bold"
                    >
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">ආයුබෝවන්, {merchantName}!</h2>
                        <p className="text-slate-500 text-sm font-medium">{shopName} පාලන පුවරුව</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                        {merchantName[0]}
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard icon={<Users className="text-blue-600" />} label="මුළු පාරිභෝගිකයින්" value="0" trend="+0%" color="bg-blue-50" />
                        <StatCard icon={<TrendingUp className="text-emerald-600" />} label="අද විකුණුම්" value="Rs. 0.00" trend="+0%" color="bg-emerald-50" />
                        <StatCard icon={<UserPlus className="text-purple-600" />} label="අලුත් ලියාපදිංචි" value="0" trend="New" color="bg-purple-50" />
                    </div>

                    {/* Quick Actions / Content Area */}
                    <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="bg-slate-100 p-6 rounded-full mb-4">
                            <Package size={48} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">තාම දත්ත මොකුත් නැහැ</h3>
                        <p className="text-slate-500 max-w-xs mt-2">
                            ඔබේ පළමු පාරිභෝගිකයා එකතු කිරීමෙන් හෝ භාණ්ඩ ඇතුළත් කිරීමෙන් වැඩේ පටන් ගන්න.
                        </p>
                        <button className="mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                            දත්ත ඇතුළත් කරන්න
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper Components
const NavItem = ({ icon, label, active = false }) => (
    <div className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${
        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}>
        {icon}
        <span className="text-sm font-bold">{label}</span>
    </div>
);

const StatCard = ({ icon, label, value, trend, color }) => (
    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color}`}>
                {icon}
            </div>
            <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-lg text-slate-600 uppercase tracking-wider">
                {trend}
            </span>
        </div>
        <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</h4>
        <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
    </div>
);

export default Dashboard;