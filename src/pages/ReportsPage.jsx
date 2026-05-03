import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ useLocation අයින් කළා (පාවිච්චි වෙන්නේ නැති නිසා)
import { LayoutDashboard, TrendingUp, Menu, X, FileText, Download } from 'lucide-react'; // ✅ පාවිච්චි වන ටික විතරක් ඉතුරු කළා
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ✅ NavItem එක උඩින්ම define කරන්න (එතකොට පැටලෙන්නේ නැහැ)
const NavItem = ({ icon, label, active = false, onClick }) => (
    <div 
        onClick={onClick} 
        className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${
            active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
    >
        {icon} <span className="text-sm font-bold">{label}</span>
    </div>
);

const ReportsPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const shopName = localStorage.getItem("shopName") || "Smart Shop";
    const merchantId = localStorage.getItem("merchantId");
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleGeneratePDF = async () => {
        if (!fromDate || !toDate) return alert("කරුණාකර දිනයන් තෝරන්න.");
        setIsGenerating(true);
        try {
            const res = await axios.get(`${apiUrl}/get-reports/${merchantId}?from=${fromDate}&to=${toDate}`);
            if (res.data.length === 0) {
                alert("මෙම කාලසීමාව තුළ ගනුදෙනු නැත.");
                return;
            }
            const doc = new jsPDF();
            doc.text(`${shopName} - ණය වාර්තාව`, 14, 20);
            doc.autoTable({
                startY: 30,
                head: [['දිනය', 'පාරිභෝගිකයා', 'වර්ගය', 'මුදල']],
                body: res.data.map(item => [
                    new Date(item.date).toLocaleDateString('en-GB'),
                    item.customerName,
                    item.type === 'add' ? 'ණය ඇඩ් කළා' : 'ණය පියෙව්වා',
                    `Rs. ${item.amount.toFixed(2)}`
                ]),
            });
            doc.save(`Report_${fromDate}_to_${toDate}.pdf`);
        } catch (err) {
            alert("PDF එක සෑදීම අසාර්ථකයි.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden text-left">
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 text-white transition-transform md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 flex justify-between items-center">
                    <h1 className="text-xl font-black text-blue-400 uppercase">SSK Manager</h1>
                    <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem icon={<LayoutDashboard size={20}/>} label="පාලන පුවරුව" onClick={() => navigate('/dashboard')} />
                    <NavItem icon={<TrendingUp size={20}/>} label="ගනුදෙනු වාර්තා" active />
                </nav>
            </aside>
            
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="bg-white border-b p-6 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 bg-slate-100 rounded-xl" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
                        <h2 className="text-2xl font-black text-slate-800">වාර්තා ලබාගැනීම</h2>
                    </div>
                </header>
                <div className="p-8">
                    <div className="bg-white p-8 rounded-[32px] border shadow-sm max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="p-4 bg-slate-50 border rounded-2xl outline-none font-bold" />
                            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="p-4 bg-slate-50 border rounded-2xl outline-none font-bold" />
                        </div>
                        <button 
                            onClick={handleGeneratePDF} 
                            disabled={isGenerating || !fromDate || !toDate} 
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                        >
                            {isGenerating ? "වාර්තාව සකසමින්..." : "PDF වාර්තාව බාගත කරන්න"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;