import React, { useState } from 'react';
import { X, MessageCircle, Smartphone, Printer } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from "jspdf";

const AddCustomerModal = ({ isOpen, onClose }) => {
    const [customerData, setCustomerData] = useState({
        name: '',
        phone: '',
        address: '',
        initialDebt: 0 
    });

    // ✅ 1. notifyMethod එක මෙතන අනිවාර්යයෙන්ම තියෙන්න ඕනේ (කලින් කෝඩ් එකේ මේක අඩුවෙලා තිබුණා)
    const [notifyMethod, setNotifyMethod] = useState('whatsapp');

    // ✅ 2. handleNotification function එක
    const handleNotification = (customer, selectedMethod) => {
        const shopName = localStorage.getItem("shopName") || 'අපගේ වෙළඳසැල';
        const message = `ආයුබෝවන් ${customer.name}, ඔබ සාර්ථකව ${shopName} සමඟ ලියාපදිංචි විය. ඔබගේ දැනට පවතින ආරම්භක ණය මුදල Rs. ${Number(customerData.initialDebt).toFixed(2)} කි. ස්තූතියි!`;

        if (selectedMethod === 'whatsapp') {
            const url = `https://wa.me/94${customer.phone.substring(1)}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        } 
        else if (selectedMethod === 'sms') {
            const url = `sms:+94${customer.phone.substring(1)}?body=${encodeURIComponent(message)}`;
            window.location.href = url;
        } 
        else if (selectedMethod === 'print') {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 400;
            canvas.height = 550;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            
            ctx.textAlign = "center";
            ctx.font = "bold 28px Arial";
            ctx.fillText(shopName, 200, 50);
            
            ctx.font = "20px Arial";
            ctx.fillText("------------------------------------------", 200, 80);
            ctx.fillText("පාරිභෝගික ලියාපදිංචි රසීදුව", 200, 110);
            ctx.fillText("------------------------------------------", 200, 140);
            
            ctx.textAlign = "left";
            ctx.font = "22px Arial";
            ctx.fillText(`නම: ${customer.name}`, 40, 190);
            ctx.fillText(`දුරකථනය: ${customer.phone}`, 40, 230);
            ctx.fillText(`ණය මුදල: Rs. ${Number(customerData.initialDebt).toFixed(2)}`, 40, 270);
            
            ctx.textAlign = "center";
            ctx.fillText("------------------------------------------", 200, 350);
            ctx.font = "20px Arial";
            ctx.fillText("ස්තූතියි! නැවත එන්න.", 200, 390);
            ctx.font = "16px Arial";
            ctx.fillText(new Date().toLocaleString(), 200, 430);

            const imgData = canvas.toDataURL("image/png");
            const doc = new jsPDF({
                unit: "mm",
                format: [80, 110]
            });
            doc.addImage(imgData, 'PNG', 0, 0, 80, 110);

            const blob = doc.output("blob");
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank"); 
        }
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        try {
            const merchantId = localStorage.getItem("merchantId");
            const apiUrl = import.meta.env.VITE_API_URL;

            if (!merchantId) {
                alert("ඔබේ ගිණුමේ දෝෂයකි. කරුණාකර Logout වී නැවත Login වන්න.");
                return;
            }

            const res = await axios.post(`${apiUrl}/add-customer`, {
                name: customerData.name,
                phone: customerData.phone,
                address: customerData.address,
                debtAmount: customerData.initialDebt,
                merchantId: merchantId
            });

            if (res.status === 201) {
                alert("පාරිභෝගිකයා සාර්ථකව ඇතුළත් කළා! ✅");
                
                // ✅ 3. මෙතන notifyMethod එක හරියට පාස් කරනවා
                handleNotification({ name: customerData.name, phone: customerData.phone }, notifyMethod);

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
            <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
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
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ලියාපදිංචි පණිවිඩය යවන ක්‍රමය</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setNotifyMethod('whatsapp')}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${notifyMethod === 'whatsapp' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                            >
                                <MessageCircle size={20} />
                                <span className="text-[10px] font-bold mt-1">WhatsApp</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setNotifyMethod('sms')}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${notifyMethod === 'sms' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                            >
                                <Smartphone size={20} />
                                <span className="text-[10px] font-bold mt-1">SMS</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setNotifyMethod('print')}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${notifyMethod === 'print' ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                            >
                                <Printer size={20} />
                                <span className="text-[10px] font-bold mt-1">Print</span>
                            </button>
                        </div>
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
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg mt-4 transition-all active:scale-95"
                    >
                        දත්ත සුරකින්න
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;