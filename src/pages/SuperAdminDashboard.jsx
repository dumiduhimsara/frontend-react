import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Redirect කිරීම සඳහා
import { Users, ShieldAlert, CheckCircle, Lock, Unlock, RefreshCw, Store } from "lucide-react";

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    // පාරිභෝගිකයින් ගෙන්නා ගැනීම
    const fetchMerchants = async () => {
        try {
            const res = await axios.get(`${apiUrl}/admin/get-all-merchants`);
            setMerchants(res.data);
        } catch (err) {
            console.error("Error fetching data!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = () => {
            // ✅ 1. Refresh කළත් Logout නොවීමට Session එක චෙක් කිරීම
            const isAuth = sessionStorage.getItem("adminAuthenticated");

            if (isAuth === "true") {
                setIsAuthenticated(true);
                fetchMerchants();
                return;
            }

            // ✅ 2. සෙෂන් එකක් නැත්නම් විතරක් පාස්වර්ඩ් එක අහනවා
            const adminPass = prompt("Enter Super Admin Password:");
            
            if (adminPass === "pakaya") {
                sessionStorage.setItem("adminAuthenticated", "true"); // Session එකේ සේව් කරනවා
                setIsAuthenticated(true);
                fetchMerchants();
            } else {
                alert("Wrong Password! Access Denied.");
                navigate('/'); // වැරදි නම් මුල් පිටුවට (Login) යවයි
            }
        };

        checkAuth();
    }, [navigate]);

    // Block/Unblock කිරීමේ ලොජික් එක
    const handleToggleBlock = async (id) => {
        if (!window.confirm("ඔබට මෙම කඩයේ තත්ත්වය වෙනස් කිරීමට අවශ්‍යද?")) return;
        try {
            await axios.put(`${apiUrl}/admin/toggle-block/${id}`);
            fetchMerchants(); 
        } catch (err) {
            alert("Error updating status");
        }
    };

    // Subscription Renew කිරීමේ ලොජික් එක
    const handleRenew = async (id) => {
        if (!window.confirm("මෙම ගිණුම තව දින 30කට අලුත් කිරීමට අවශ්‍යද?")) return;
        try {
            await axios.put(`${apiUrl}/admin/renew-subscription/${id}`);
            alert("සාර්ථකව අලුත් කළා! ✅");
            fetchMerchants();
        } catch (err) {
            alert("Error renewing subscription");
        }
    };

    // ✅ ලොග් වෙලා නැත්නම් හෝ පාස්වර්ඩ් එක වැරදි නම් කිසිවක් Render කරන්නේ නැත
    if (!isAuthenticated) return null;

    if (loading) return <div className="flex justify-center items-center h-screen font-black uppercase text-slate-400">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-left">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Super Admin Dashboard</h1>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">SSK Manager System Control</p>
                </header>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">මුළු කඩවල් ගණන</p>
                        <h2 className="text-4xl font-black text-slate-900">{merchants.length}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Merchants</p>
                        <h2 className="text-4xl font-black text-green-600">{merchants.filter(m => !m.isBlocked).length}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Blocked Merchants</p>
                        <h2 className="text-4xl font-black text-red-600">{merchants.filter(m => m.isBlocked).length}</h2>
                    </div>
                </div>

                {/* Merchants Table */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Shop & Owner</th>
                                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Customers</th>
                                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Expiry</th>
                                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {merchants.map((m) => (
                                    <tr key={m._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                        <td className="p-5">
                                            <p className="font-black text-slate-800 text-base leading-tight">{m.shopName}</p>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">{m.ownerName} • {m.phone}</p>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className="inline-flex items-center justify-center bg-blue-50 text-blue-600 w-10 h-10 rounded-xl font-black">{m.customerCount || 0}</span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                {m.isBlocked ? (
                                                    <span className="text-[10px] font-black text-red-500 uppercase flex items-center gap-1"><ShieldAlert size={12}/> Account Blocked</span>
                                                ) : (
                                                    <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1"><CheckCircle size={12}/> Subscription {m.subscriptionStatus}</span>
                                                )}
                                                <p className="text-xs font-bold text-slate-400">Expires: {m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('en-GB') : "N/A"}</p>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleRenew(m._id)}
                                                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                                                    title="Renew 30 Days"
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleToggleBlock(m._id)}
                                                    className={`p-3 rounded-xl transition-all ${m.isBlocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                                                    title={m.isBlocked ? "Unblock" : "Block"}
                                                >
                                                    {m.isBlocked ? <Unlock size={18} /> : <Lock size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;