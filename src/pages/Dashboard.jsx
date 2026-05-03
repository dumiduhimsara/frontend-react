import React, { useState, useEffect } from 'react'; 
import AddCustomerModal from '../components/AddCustomerModal';
import CustomerDetailsModal from '../components/CustomerDetailsModal'; 
import { 
  LayoutDashboard, Users, Package, ShoppingCart, Settings, 
  LogOut, TrendingUp, UserPlus, Menu, X, PlusCircle, MinusCircle, Phone, AlertCircle,
  Bell, MessageCircle, PhoneOutgoing
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customers, setCustomers] = useState([]); 
    const [selectedCustomer, setSelectedCustomer] = useState(null); 
    const [updateAmount, setUpdateAmount] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); 
    const [history, setHistory] = useState([]); 
    const [dueDate, setDueDate] = useState(''); 
    
    // ✅ විසඳුම 4: Refresh කළත් මතක තබා ගැනීමට LocalStorage භාවිතය
    const [remindedCustomers, setRemindedCustomers] = useState(() => {
        const saved = localStorage.getItem('reminded_today');
        return saved ? JSON.parse(saved) : [];
    });

    const merchantName = localStorage.getItem("merchantName") || "මුදලාලි";
    const shopName = localStorage.getItem("shopName") || "Smart Shop";
    const merchantId = localStorage.getItem("merchantId");
    const apiUrl = import.meta.env.VITE_API_URL;

    // LocalStorage එකට දත්ත සේව් කිරීම
    useEffect(() => {
        localStorage.setItem('reminded_today', JSON.stringify(remindedCustomers));
    }, [remindedCustomers]);

    // --- ණය වැඩිම පාරිභෝගිකයින් 5 දෙනා තෝරා ගැනීම ---
    const topDebtors = [...customers]
        .sort((a, b) => b.debtAmount - a.debtAmount)
        .slice(0, 5);

    const upcomingReminders = customers.filter(customer => {
        if (!customer.dueDate || customer.debtAmount <= 0) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const customerDueDate = new Date(customer.dueDate);
        customerDueDate.setHours(0, 0, 0, 0);
        const diffTime = customerDueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 2;
    }); 

    const overdueCustomers = customers.filter(customer => {
        if (!customer.dueDate || customer.debtAmount <= 0) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const customerDueDate = new Date(customer.dueDate);
        customerDueDate.setHours(0, 0, 0, 0);
        return customerDueDate < today;
    });

    const fetchHistory = async (customerId) => {
        try {
            const res = await axios.get(`${apiUrl}/get-history/${customerId}`);
            setHistory(res.data);
        } catch (err) {
            console.error("Error fetching history:", err);
        }
    };

    // ✅ WhatsApp පණිවිඩය යැවීම සහ ලකුණු කිරීම
    const sendWhatsApp = (c) => {
        const dateStr = new Date(c.dueDate).toLocaleDateString('en-GB');
        const message = `ආයුබෝවන් ${c.name}, ${shopName} වෙත ඔබ ගෙවීමට ඇති රු. ${Math.abs(c.debtAmount).toFixed(2)} ක ණය මුදල ${dateStr} දිනට පෙර ගෙවන ලෙස කාරුණිකව මතක් කරමු. ස්තූතියි!`;
        const url = `https://wa.me/94${c.phone.substring(1)}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        if (!remindedCustomers.includes(c._id)) {
            setRemindedCustomers(prev => [...prev, c._id]);
        }
    };

    // ✅ සාමාන්‍ය SMS පණිවිඩය යැවීම සහ ලකුණු කිරීම
    const sendSMS = (c) => {
        const dateStr = new Date(c.dueDate).toLocaleDateString('en-GB');
        const message = `Ayubowan ${c.name}, ${shopName} naya mudala Rs. ${Math.abs(c.debtAmount).toFixed(2)} labana ${dateStr} dinata pera gewana lesa mathak karamu. Sthuthiy!`;
        window.location.href = `sms:+94${c.phone.substring(1)}?body=${encodeURIComponent(message)}`;
        if (!remindedCustomers.includes(c._id)) {
            setRemindedCustomers(prev => [...prev, c._id]);
        }
    };

    const handleDeleteCustomer = async (id) => {
        if (window.confirm("ඔබට විශ්වාසද මෙම පාරිභෝගිකයා ඉවත් කළ යුතු බව?")) {
            try {
                const res = await axios.delete(`${apiUrl}/delete-customer/${id}`);
                if (res.status === 200) {
                    alert(res.data.message);
                    setSelectedCustomer(null); 
                    fetchCustomers(); 
                }
            } catch (err) {
                alert("ඉවත් කිරීම අසාර්ථකයි.");
            }
        }
    };

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        customer.phone.includes(searchTerm)
    );

    const fetchCustomers = async () => {
        try {
            const res = await axios.get(`${apiUrl}/get-customers/${merchantId}`);
            setCustomers(res.data);
        } catch (err) {
            console.error("Error fetching customers:", err);
        }
    };

    useEffect(() => {
        if (merchantId) fetchCustomers();
    }, [merchantId]);

    const handleUpdateDebt = async (id, type) => {
        if (!updateAmount || isNaN(updateAmount)) return alert("කරුණාකර නිවැරදි මුදලක් ඇතුළත් කරන්න.");
        
        try {
            const res = await axios.put(`${apiUrl}/update-debt/${id}`, {
                amount: updateAmount,
                type: type,
                dueDate: dueDate
            });

            if (res.status === 200) {
                alert(res.data.message);
                setUpdateAmount('');
                setDueDate('');
                setSelectedCustomer(null);
                fetchCustomers(); 
            }
        } catch (err) {
            alert("Error updating debt");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 text-white transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:flex`}>
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-blue-400 uppercase">SSK Manager</h1>
                        <p className="text-[10px] text-blue-300/50 font-bold uppercase tracking-widest mt-1">Professional Edition</p>
                    </div>
                    <button className="md:hidden p-1 hover:bg-white/10 rounded-lg" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
                    <NavItem icon={<Users size={20}/>} label="Customers" />
                    <NavItem icon={<Package size={20}/>} label="Products" />
                    <NavItem icon={<ShoppingCart size={20}/>} label="Orders" />
                    <NavItem icon={<Settings size={20}/>} label="Settings" />
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-bold"><LogOut size={20} /><span>Log Out</span></button>
                </div>
            </aside>

            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            <main className="flex-1 flex flex-col h-screen overflow-y-auto text-left">
                <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4 text-left">
                        <button className="md:hidden p-2 bg-slate-100 rounded-xl text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-800">ආයුබෝවන්, {merchantName}!</h2>
                            <p className="text-slate-500 text-xs md:text-sm font-medium">{shopName} පාලන පුවරුව</p>
                        </div>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">{merchantName[0]}</div>
                </header>

                <div className="p-4 md:p-8 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                        <StatCard icon={<Users className="text-blue-600" />} label="මුළු පාරිභෝගිකයින්" value={customers.length} trend="+0%" color="bg-blue-50" />
                        <StatCard 
                            icon={<AlertCircle className="text-red-600" />} 
                            label="වැඩිම ණය ඇති පාරිභෝගිකයා" 
                            value={topDebtors.length > 0 && topDebtors[0].debtAmount > 0 ? `Rs. ${topDebtors[0].debtAmount.toFixed(2)}` : "Rs. 0.00"} 
                            trend={topDebtors.length > 0 && topDebtors[0].debtAmount > 0 ? topDebtors[0].name : "N/A"} 
                            color="bg-red-50" 
                        />
                        <StatCard icon={<TrendingUp className="text-emerald-600" />} label="අද විකුණුම්" value="Rs. 0.00" trend="+0%" color="bg-emerald-50" />
                    </div>

                    {/* ✅ විසඳුම 3: නියමිත දිනට ණය නොගෙවූ අයටත් SMS ඔප්ෂන් එක එකතු කළා */}
                    {overdueCustomers.length > 0 && (
                        <div className="bg-red-50 rounded-[32px] p-6 border border-red-100 mb-8 text-left">
                            <div className="flex items-center gap-3 mb-6 text-red-600">
                                <AlertCircle size={20} />
                                <h3 className="text-xl font-black italic">නියමිත දිනට ණය නොගෙවූ අය</h3>
                            </div>
                            <div className="space-y-4">
                                {overdueCustomers.map((c) => (
                                    <div key={c._id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-red-200 shadow-sm">
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                                            <p className="text-[10px] text-red-600 font-black uppercase">
                                                ගෙවිය යුතුව තිබුණේ: {new Date(c.dueDate).toLocaleDateString('en-GB')}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {remindedCustomers.includes(c._id) ? (
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1">මතක් කළා ✅</span>
                                            ) : (
                                                <>
                                                    <button onClick={() => sendWhatsApp(c)} className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-90"><MessageCircle size={18} /></button>
                                                    <button onClick={() => sendSMS(c)} className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-90"><PhoneOutgoing size={18} /></button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Reminders */}
                    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm mb-8 text-left">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Bell size={20} /></div>
                            <h3 className="text-xl font-black text-slate-800">ළඟදී ණය ගෙවිය යුතු අය (ඉදිරි දින 2)</h3>
                        </div>
                        <div className="space-y-4">
                            {upcomingReminders.length === 0 ? (
                                <p className="text-slate-400 font-bold text-sm ml-2">දැනට මතක් කිරීමට කිසිවෙකු නැත.</p>
                            ) : (
                                upcomingReminders.map((c) => {
                                    const diffDays = Math.ceil((new Date(c.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                                    return (
                                        <div key={c._id} className="flex items-center justify-between p-4 bg-orange-50/30 rounded-2xl border border-orange-100 hover:bg-orange-50 transition-all">
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">{c.name}</p>
                                                <p className="text-[10px] text-orange-600 font-black uppercase tracking-wider">
                                                   {diffDays === 0 ? "අද දින ගෙවිය යුතුයි" : `තව දින ${diffDays} කින් ගෙවිය යුතුයි`}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {remindedCustomers.includes(c._id) ? (
                                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1 animate-in zoom-in">මතක් කළා ✅</span>
                                                ) : (
                                                    <>
                                                        <button onClick={() => sendWhatsApp(c)} className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-90" title="WhatsApp"><MessageCircle size={18} /></button>
                                                        <button onClick={() => sendSMS(c)} className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-90" title="SMS"><PhoneOutgoing size={18} /></button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Top 5 Debtors */}
                    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm mb-8 text-left">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-50 text-red-600 rounded-xl"><TrendingUp size={20} /></div>
                            <h3 className="text-xl font-black text-slate-800">වැඩිම ණය ඇති අය (Top 5)</h3>
                        </div>
                        <div className="space-y-4">
                            {topDebtors.filter(d => d.debtAmount > 0).length === 0 ? (
                                <p className="text-slate-400 font-bold text-sm ml-2">ණය ඇති පාරිභෝගිකයින් නැත.</p>
                            ) : (
                                topDebtors.filter(d => d.debtAmount > 0).map((debtor, index) => (
                                    <div key={debtor._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">{index + 1}</div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">{debtor.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{debtor.phone}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-red-600 text-sm">Rs. {debtor.debtAmount.toLocaleString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-4 text-left">
                        <h3 className="text-xl font-black text-slate-800">පාරිභෝගික ලැයිස්තුව</h3>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md active:scale-95"><PlusCircle size={18} /> අලුත් කෙනෙක්</button>
                    </div>

                    <div className="mb-6 text-left">
                        <input 
                            type="text" 
                            placeholder="නම හෝ දුරකථන අංකය මගින් සොයන්න..."
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {filteredCustomers.length === 0 ? (
                        <div className="bg-white rounded-[32px] p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                            <Package size={48} className="text-slate-200 mb-4" />
                            <h3 className="text-lg font-bold text-slate-400">ගැලපෙන පාරිභෝගිකයෝ නැත</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCustomers.map((customer) => (
                                <div key={customer._id} className="relative bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 font-bold text-lg">{customer.name[0]}</div>
                                        <div className="text-right">
                                            {/* ✅ විසඳුම 1: ණය පියවා වැඩිපුර ඇති විට කොළ පාටින් Balance එක පෙන්වීම */}
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                {customer.debtAmount < 0 ? 'කඩේ ගාව ඇති මුදල' : 'දැනට ණය මුදල'}
                                            </p>
                                            <p className={`text-xl font-black ${customer.debtAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                Rs. {Math.abs(customer.debtAmount).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-800 leading-tight">{customer.name}</h4>
                                    <div className="flex items-center text-slate-500 text-sm mt-1 mb-4 gap-1"><Phone size={14} /> {customer.phone}</div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => { setSelectedCustomer(customer); setUpdateAmount('0'); }} className="py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all active:scale-95">ණය Update</button>
                                        <button onClick={() => { setSelectedCustomer(customer); setUpdateAmount(''); fetchHistory(customer._id); }} className="py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all active:scale-95">විස්තර බලන්න</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal for managing debt */}
            {selectedCustomer && updateAmount !== '' && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-800">ණය කළමනාකරණය</h3>
                            <button onClick={() => setSelectedCustomer(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors"><X size={20}/></button>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl mb-6 text-left">
                            <p className="text-xs font-bold text-slate-400 uppercase">පාරිභෝගිකයා</p>
                            <p className="text-lg font-black text-slate-800">{selectedCustomer.name}</p>
                        </div>
                        <input 
                            type="number" 
                            placeholder="මුදල (Rs.)"
                            className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-xl mb-6 text-left"
                            value={updateAmount === '0' ? '' : updateAmount}
                            onChange={(e) => setUpdateAmount(e.target.value)}
                        />
                        <div className="mb-6 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ණය ගෙවීමට පොරොන්දු වූ දිනය</label>
                            <input 
                                type="date" 
                                className="w-full mt-1 px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleUpdateDebt(selectedCustomer._id, 'add')} className="flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20"><PlusCircle size={18} /> ඇඩ් කරන්න</button>
                            <button onClick={() => handleUpdateDebt(selectedCustomer._id, 'settle')} className="flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-600/20"><MinusCircle size={18} /> පියවන්න</button>
                        </div>
                    </div>
                </div>
            )}

            <CustomerDetailsModal isOpen={selectedCustomer && updateAmount === ''} customer={selectedCustomer} history={history} onClose={() => setSelectedCustomer(null)} onDelete={handleDeleteCustomer} />
            <AddCustomerModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchCustomers(); }} />
        </div>
    );
};

const NavItem = ({ icon, label, active = false }) => (
    <div className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
        {icon}
        <span className="text-sm font-bold">{label}</span>
    </div>
);

const StatCard = ({ icon, label, value, trend, color }) => (
    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color}`}>{icon}</div>
            <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-lg text-slate-600 uppercase tracking-wider">{trend}</span>
        </div>
        <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</h4>
        <p className="text-xl md:text-2xl font-black text-slate-800 mt-1">{value}</p>
    </div>
);

export default Dashboard;