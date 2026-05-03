import React, { useState, useEffect } from 'react'; 
import AddCustomerModal from '../components/AddCustomerModal';
import CustomerDetailsModal from '../components/CustomerDetailsModal'; 
import { 
  LayoutDashboard, Users, TrendingUp, Menu, X, PlusCircle, 
  MinusCircle, Phone, AlertCircle, Bell, MessageCircle, 
  PhoneOutgoing, LogOut, FileText
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation(); // දැනට ඉන්න පිටුව දැනගැනීමට
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customers, setCustomers] = useState([]); 
    const [selectedCustomer, setSelectedCustomer] = useState(null); 
    const [updateAmount, setUpdateAmount] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); 
    const [history, setHistory] = useState([]); 
    const [dueDate, setDueDate] = useState(''); 
    const [isUpdating, setIsUpdating] = useState(false);

    const merchantName = localStorage.getItem("merchantName") || "මුදලාලි";
    const shopName = localStorage.getItem("shopName") || "Smart Shop";
    const merchantId = localStorage.getItem("merchantId");
    const apiUrl = import.meta.env.VITE_API_URL;

    // --- ණය වැඩිම පාරිභෝගිකයින් 5 දෙනා ---
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

    const totalDebt = customers.reduce((acc, curr) => acc + (curr.debtAmount > 0 ? curr.debtAmount : 0), 0);

    const fetchHistory = async (customerId) => {
        try {
            const res = await axios.get(`${apiUrl}/get-history/${customerId}`);
            setHistory(res.data);
        } catch (err) {
            console.error("Error fetching history:", err);
        }
    };

    const updateReminderStatus = async (customerId, type) => {
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            await axios.put(`${apiUrl}/update-reminder/${customerId}`, {
                lastRemindedDate: todayStr,
                lastRemindedType: type
            });
            fetchCustomers(); 
        } catch (err) {
            console.error("Reminder sync error:", err);
        }
    };

    const sendWhatsApp = (c, type) => {
        const dateStr = new Date(c.dueDate).toLocaleDateString('en-GB');
        let message = "";
        if (type === 'upcoming') {
            message = `ආයුබෝවන් ${c.name}, ${shopName} වෙත ඔබ ගෙවීමට ඇති රු. ${Math.abs(c.debtAmount).toFixed(2)} ක ණය මුදල ${dateStr} දිනට පෙර ගෙවන ලෙස කාරුණිකව මතක් කරමු. ස්තූතියි!`;
        } else {
            message = `ආයුබෝවන් ${c.name}, ${shopName} වෙත ඔබ ${dateStr} දින ගෙවීමට පොරොන්දු වූ රු. ${Math.abs(c.debtAmount).toFixed(2)} ක ණය මුදල මෙතෙක් ගෙවා නැත. කරුණාකර එය කඩිනමින් පියවීමට කටයුතු කරන්න. ස්තූතියි!`;
        }
        const url = `https://wa.me/94${c.phone.substring(1)}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        updateReminderStatus(c._id, type);
    };

    const sendSMS = (c, type) => {
        const dateStr = new Date(c.dueDate).toLocaleDateString('en-GB');
        let message = "";
        if (type === 'upcoming') {
            message = `Ayubowan ${c.name}, ${shopName} naya Rs. ${Math.abs(c.debtAmount).toFixed(2)} labana ${dateStr} dinata pera gewana lesa mathak karamu. Sthuthiy!`;
        } else {
            message = `Ayubowan ${c.name}, ${shopName} naya Rs. ${Math.abs(c.debtAmount).toFixed(2)} ${dateStr} dina gewimata thibu naya mudala ada dakkwa gewa natha. Karunakar ey kandinamin piyanwanna. Sthuthiy!`;
        }
        window.location.href = `sms:+94${c.phone.substring(1)}?body=${encodeURIComponent(message)}`;
        updateReminderStatus(c._id, type);
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
        setIsUpdating(true); 
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
        } finally {
            setIsUpdating(false); 
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const isAlreadyReminded = (customer, listType) => {
        const todayStr = new Date().toISOString().split('T')[0];
        return customer.lastRemindedDate === todayStr && customer.lastRemindedType === listType;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            {/* ✅ පිරිසිදු කරන ලද Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 text-white transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:flex`}>
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-blue-400 uppercase">SSK Manager</h1>
                        <p className="text-[10px] text-blue-300/50 font-bold uppercase tracking-widest mt-1">Professional Edition</p>
                    </div>
                    <button className="md:hidden p-1 hover:bg-white/10 rounded-lg" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
                </div>
                
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem 
                        icon={<LayoutDashboard size={20}/>} 
                        label="පාලන පුවරුව" 
                        active={location.pathname === '/dashboard'} 
                        onClick={() => navigate('/dashboard')} 
                    />
                    <NavItem 
                        icon={<FileText size={20}/>} 
                        label="ගනුදෙනු වාර්තා" 
                        active={location.pathname === '/reports'} 
                        onClick={() => navigate('/reports')} 
                    />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-bold">
                        <LogOut size={20} /><span>Log Out</span>
                    </button>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch text-left">
                        <StatCard 
                            icon={<Users size={24} className="text-blue-600" />} 
                            label="මුළු පාරිභෝගිකයින්" 
                            value={customers.length} 
                            trend="+0%" 
                            color="bg-blue-500/60" 
                            bgColor="bg-blue-200" 
                        />
                        <StatCard 
                            icon={<AlertCircle size={24} className="text-red-600" />} 
                            label="වැඩිම ණය ඇති පාරිභෝගිකයා" 
                            value={topDebtors.length > 0 && topDebtors[0].debtAmount > 0 ? `Rs. ${topDebtors[0].debtAmount.toFixed(2)}` : "Rs. 0.00"} 
                            trend={topDebtors.length > 0 && topDebtors[0].debtAmount > 0 ? topDebtors[0].name : "N/A"} 
                            color="bg-red-500/60" 
                            bgColor="bg-red-200" 
                        />
                        <StatCard 
                            icon={<TrendingUp size={24} className="text-emerald-600" />} 
                            label="මුළු ණය මුදල (Total)" 
                            value={`Rs. ${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                            trend="ලැබීමට ඇති" 
                            color="bg-emerald-500/60" 
                            bgColor="bg-emerald-200" 
                        />
                    </div>

                    {overdueCustomers.length > 0 && (
                        <div className="bg-red-100/50 rounded-[32px] p-6 border border-red-100 mb-8 text-left">
                            <div className="flex items-center gap-3 mb-6 text-red-600">
                                <AlertCircle size={20} />
                                <h3 className="text-xl font-black italic">නියමිත දිනට ණය නොගෙවූ අය</h3>
                            </div>
                            <div className="space-y-4">
                                {overdueCustomers.map((c) => (
                                    <div key={c._id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-red-200 shadow-sm">
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5"><Phone size={10} /> {c.phone}</p>
                                            <p className="text-[10px] text-red-600 font-black uppercase mt-1">ගෙවිය යුතුව තිබුණේ: {new Date(c.dueDate).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {isAlreadyReminded(c, 'overdue') ? (
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1">මතක් කළා ✅</span>
                                            ) : (
                                                <>
                                                    <button onClick={() => sendWhatsApp(c, 'overdue')} className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-90"><MessageCircle size={18} /></button>
                                                    <button onClick={() => sendSMS(c, 'overdue')} className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-90"><PhoneOutgoing size={18} /></button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-orange-100/50 rounded-[32px] p-6 border border-orange-100 shadow-sm mb-8 text-left">
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
                                                <p className="text-[10px] text-orange-600 font-black uppercase tracking-wider mt-0.5">
                                                    {diffDays === 0 ? "අද දින ගෙවිය යුතුයි" : `තව දින ${diffDays} කින් ගෙවිය යුතුයි`}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {isAlreadyReminded(c, 'upcoming') ? (
                                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1">මතක් කළා ✅</span>
                                                ) : (
                                                    <>
                                                        <button onClick={() => sendWhatsApp(c, 'upcoming')} className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-90"><MessageCircle size={18} /></button>
                                                        <button onClick={() => sendSMS(c, 'upcoming')} className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-90"><PhoneOutgoing size={18} /></button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="bg-red-100/50 rounded-[32px] p-6 border border-red-200 mb-8 text-left shadow-sm">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm)).map((customer) => (
                            <div key={customer._id} className="relative bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 font-bold text-lg">{customer.name[0]}</div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{customer.debtAmount < 0 ? 'කඩේ ගාව ඇති මුදල' : 'දැනට ණය මුදල'}</p>
                                        <p className={`text-xl font-black ${customer.debtAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>Rs. {Math.abs(customer.debtAmount).toFixed(2)}</p>
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
                </div>
            </main>

            {/* Debt Management Modal */}
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
                            <button 
                                onClick={() => handleUpdateDebt(selectedCustomer._id, 'add')} 
                                disabled={isUpdating} 
                                className={`flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20 ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 active:scale-95'}`}
                            >
                                {isUpdating ? <span className="flex items-center gap-2 italic">මොහොතක් ඉන්න...</span> : <><PlusCircle size={18} /> ඇඩ් කරන්න</>}
                            </button>
                            <button 
                                onClick={() => handleUpdateDebt(selectedCustomer._id, 'settle')} 
                                disabled={isUpdating} 
                                className={`flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700 active:scale-95'}`}
                            >
                                {isUpdating ? <span className="flex items-center gap-2 italic">මොහොතක් ඉන්න...</span> : <><MinusCircle size={18} /> පියවන්න</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CustomerDetailsModal isOpen={selectedCustomer && updateAmount === ''} customer={selectedCustomer} history={history} onClose={() => setSelectedCustomer(null)} onDelete={handleDeleteCustomer} />
            <AddCustomerModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchCustomers(); }} />
        </div>
    );
};

// NavItem component ඇතුළත onClick සම්බන්ධ කළා
const NavItem = ({ icon, label, active = false, onClick }) => (
    <div 
        onClick={onClick}
        className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
    >
        {icon}
        <span className="text-sm font-bold">{label}</span>
    </div>
);

const StatCard = ({ icon, label, value, trend, color, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:scale-[1.02] flex flex-col justify-between h-full w-full min-h-[180px]`}>
        <div className="flex justify-between items-start mb-6 gap-2">
            <div className={`p-3 rounded-2xl ${color} shrink-0`}>{icon}</div>
            <span className="text-[10px] font-black px-2.5 py-1.5 bg-white/60 backdrop-blur-md rounded-xl text-slate-600 uppercase tracking-wider shadow-sm max-w-[120px] truncate">{trend}</span>
        </div>
        <div className="text-left mt-auto">
            <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-2">{label}</h4>
            <p className="text-xl md:text-2xl font-black text-slate-800 leading-tight break-words">{value}</p>
        </div>
    </div>
);

export default Dashboard;