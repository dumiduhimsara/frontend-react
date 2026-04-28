import React, { useState } from 'react';
import { X, Banknote } from 'lucide-react';
import axios from 'axios';

const AddCustomerModal = ({ isOpen, onClose }) => {
    const [customerData, setCustomerData] = useState({
        name: '',
        phone: '',
        address: '',
        initialDebt: 0 
    });


    const handleAddCustomer = async (e) => {
        e.preventDefault();
        console.log("Button Clicked!");
        try {
            const merchantId = localStorage.getItem("merchantId");
            const apiUrl = import.meta.env.VITE_API_URL;

            // ✅ Debugging: Console එකේ බලන්න ID එක එනවද කියලා
            console.log("Merchant ID from storage:", merchantId);

            if (!merchantId) {
                alert("ඔබේ ගිණුමේ දෝෂයකි. කරුණාකර Logout වී නැවත Login වන්න.");
                return;
            }

            const res = await axios.post(`${apiUrl}/add-customer`, {
                name: customerData.name,
                phone: customerData.phone,
                address: customerData.address,
                debtAmount: customerData.initialDebt, // ✅ ණය මුදල Backend එකට යවනවා
                merchantId: merchantId
            });

            if (res.status === 201) {
                alert("පාරිභෝගිකයා සාර්ථකව ඇතුළත් කළා! ✅");
                setCustomerData({ name: '', phone: '', address: '', initialDebt: 0 });
                onClose();
            }
        } catch (err) {
            console.error("Error detailing:", err.response?.data);
            alert(err.response?.data?.message || "ඇතුළත් කිරීම අසාර්ථකයි.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight text-left">අලුත් පාරිභෝගිකයෙක්</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleAddCustomer} className="space-y-4">
                    <div className="text-left">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">පූර්ණ නම</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold"
                            value={customerData.name}
                            onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="text-left">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">දුරකථන අංකය</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold"
                            value={customerData.phone}
                            onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                            required
                        />
                    </div>

                    {/* ✅ ණය මුදල ඇතුළත් කිරීමට නව Input එක */}
                    <div className="text-left">
                        <label className="text-xs font-bold text-red-400 uppercase tracking-widest ml-1">පරණ ණය මුදල (ඇත්නම්)</label>
                        <input 
                            type="number" 
                            placeholder="Rs. 0.00"
                            className="w-full mt-1 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-400 outline-none transition-all font-bold text-red-600"
                            value={customerData.initialDebt}
                            onChange={(e) => setCustomerData({...customerData, initialDebt: e.target.value})}
                        />
                    </div>

                    <div className="text-left">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ලිපිනය</label>
                        <textarea 
                            className="w-full mt-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold min-h-[80px]"
                            value={customerData.address}
                            onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 mt-4"
                    >
                        දත්ත සුරකින්න
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;