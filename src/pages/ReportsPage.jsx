import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Menu, X, FileText, Download } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ✅ NavItem Component එක (Build errors වළක්වා ගැනීමට ප්‍රධාන component එකෙන් පිටත තබා ඇත)
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

    // LocalStorage වලින් දත්ත ලබා ගැනීම
    const merchantName = localStorage.getItem("merchantName") || "මුදලාලි";
    const shopName = localStorage.getItem("shopName") || "Smart Shop";
    const merchantId = localStorage.getItem("merchantId");
    const apiUrl = import.meta.env.VITE_API_URL;

const handleGeneratePDF = async () => {
    if (!fromDate || !toDate) return alert("කරුණාකර දිනයන් තෝරන්න.");
    
    setIsGenerating(true);
    try {
        const res = await axios.get(`${apiUrl}/get-reports/${merchantId}?from=${fromDate}&to=${toDate}`);
        
        if (!res.data || res.data.length === 0) {
            alert("මෙම කාලසීමාව තුළ ගනුදෙනු කිසිවක් හමු වුණේ නැත.");
            setIsGenerating(false);
            return;
        }

        const doc = new jsPDF();
        
        // --- PDF Heading (English icons/text to avoid symbols) ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(`${shopName} - Credit Report`, 14, 20);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Duration: ${fromDate} to ${toDate}`, 14, 28);
        doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 14, 34);

        // --- දත්ත සකස් කිරීම (සිංග්ලිෂ් භාවිතයෙන්) ---
        const tableBody = res.data.map(item => [
            item.date ? new Date(item.date).toLocaleDateString('en-GB') : "N/A",
            item.customerName || "No Name", 
            item.type === 'add' ? 'Credit Added' : 'Payment Settled', // ණය එකතු කළා -> Credit Added
            item.amount !== undefined ? `Rs. ${Number(item.amount).toFixed(2)}` : "Rs. 0.00"
        ]);

        // --- Table එක සැකසීම ---
        autoTable(doc, {
            startY: 40,
            head: [['Date', 'Customer', 'Type', 'Amount']], // Heading ටිකත් ඉංග්‍රීසියෙන්
            body: tableBody,
            styles: { font: "helvetica", fontSize: 10 },
            headStyles: { 
                fillColor: [37, 99, 235], 
                textColor: [255, 255, 255], 
                fontStyle: 'bold' 
            },
            alternateRowStyles: { fillColor: [241, 245, 249] },
            margin: { top: 40 },
        });

        doc.save(`${shopName}_Report_${fromDate}.pdf`);
    } catch (err) {
        console.error("PDF Detailed Error:", err);
        alert("PDF එක සෑදීමේදී දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.");
    } finally {
        setIsGenerating(false);
    }
};

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden text-left font-sans">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-black text-blue-400 uppercase tracking-tighter">SSK Manager</h1>
                        <p className="text-[10px] text-blue-300/50 font-bold uppercase tracking-widest mt-1">Professional Edition</p>
                    </div>
                    <button className="md:hidden p-1 hover:bg-white/10 rounded-lg" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
                </div>
                
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem icon={<LayoutDashboard size={20}/>} label="පාලන පුවරුව" onClick={() => navigate('/dashboard')} />
                    <NavItem icon={<TrendingUp size={20}/>} label="ගනුදෙනු වාර්තා" active />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-bold">
                        <LogOut size={20} /><span>Log Out</span>
                    </button>
                </div>
            </aside>
            
            {/* Overlay for Mobile Sidebar */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 bg-slate-100 rounded-xl text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-800">වාර්තා ලබාගැනීම</h2>
                            <p className="text-slate-500 text-xs font-medium">ගනුදෙනු විස්තර PDF ලෙස ලබාගන්න</p>
                        </div>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">{merchantName[0]}</div>
                </header>

                <div className="p-4 md:p-8 flex justify-center items-start pt-10">
                    <div className="bg-white w-full max-w-2xl p-6 md:p-10 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shrink-0"><FileText size={24} /></div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">කාලසීමාව තෝරන්න</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mb-10">
                            {/* සිට (From Date) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">සිට (From)</label>
                                <input 
                                    type="date" 
                                    value={fromDate} 
                                    onChange={(e) => setFromDate(e.target.value)} 
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-800 transition-all" 
                                />
                            </div>

                            {/* දක්වා (To Date) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">දක්වා (To)</label>
                                <input 
                                    type="date" 
                                    value={toDate} 
                                    onChange={(e) => setToDate(e.target.value)} 
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-800 transition-all" 
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleGeneratePDF} 
                            disabled={isGenerating || !fromDate || !toDate} 
                            className={`w-full py-5 rounded-2xl font-black text-base md:text-lg transition-all flex items-center justify-center gap-2 shadow-xl ${
                                isGenerating 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700 active:scale-95'
                            }`}
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2">සකසමින්...</span>
                            ) : (
                                <><Download size={22} /> PDF වාර්තාව බාගත කරන්න</>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

// LogOut Icon එක lucide-react වලින් ගන්න බැරි වුණොත් පාවිච්චි කිරීමට
const LogOut = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

export default ReportsPage;