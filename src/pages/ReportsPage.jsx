import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Menu, X, FileText, Download, Database } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    const [isGeneratingMaster, setIsGeneratingMaster] = useState(false);

    const merchantName = localStorage.getItem("merchantName") || "මුදලාලි";
    const shopName = localStorage.getItem("shopName") || "Smart Shop";
    const merchantId = localStorage.getItem("merchantId");
    const apiUrl = import.meta.env.VITE_API_URL;

    // --- 1. තෝරාගත් දින අතර වාර්තාව (කලින් තිබූ එක) ---
    const handleGeneratePDF = async () => {
        if (!fromDate || !toDate) return alert("කරුණාකර දිනයන් තෝරන්න.");
        setIsGenerating(true);
        try {
            const res = await axios.get(`${apiUrl}/get-reports/${merchantId}?from=${fromDate}&to=${toDate}`);
            if (!res.data || res.data.length === 0) {
                alert("මෙම කාලසීමාව තුළ ගනුදෙනු නැත.");
                setIsGenerating(false);
                return;
            }

            const doc = new jsPDF();
            doc.setFont("helvetica", "bold");
            doc.text(`${shopName} - Period Report`, 14, 20);
            doc.setFontSize(10);
            doc.text(`Duration: ${fromDate} to ${toDate}`, 14, 28);

            const tableBody = res.data.map(item => [
                new Date(item.date).toLocaleDateString('en-GB'),
                item.customerName || "No Name",
                item.type === 'add' ? 'Added' : 'Settled',
                `Rs. ${Number(item.amount).toFixed(2)}`
            ]);

            autoTable(doc, {
                startY: 35,
                head: [['Date', 'Customer', 'Type', 'Amount']],
                body: tableBody,
                headStyles: { fillColor: [37, 99, 235] }
            });

            doc.save(`Report_${fromDate}_to_${toDate}.pdf`);
        } catch (err) {
            alert("වාර්තාව සැකසීම අසාර්ථකයි.");
        } finally {
            setIsGenerating(false);
        }
    };

    // --- 2. Master Backup Report (ඔයා ඉල්ලපු අලුත් එක) ---
    const handleGenerateMasterPDF = async () => {
        setIsGeneratingMaster(true);
        try {
            // Backend එකේ අපි සාදාගත් master endpoint එකට කෝල් කිරීම
            const res = await axios.get(`${apiUrl}/get-master-report/${merchantId}`);
            const allData = res.data;

            const doc = new jsPDF();
            let currentY = 20;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text(`${shopName} - Master Backup Report`, 14, currentY);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            currentY += 10;
            doc.text(`Full Database Backup Generated on: ${new Date().toLocaleString('en-GB')}`, 14, currentY);
            currentY += 15;

            allData.forEach((item, index) => {
                // පිටුව ඉවර වුණොත් අලුත් පිටුවක් ඇඩ් කිරීම
                if (currentY > 240) {
                    doc.addPage();
                    currentY = 20;
                }

                // පාරිභෝගිකයාගේ විස්තර (Header)
                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(37, 99, 235);
                doc.text(`${index + 1}. ${item.info.name} (${item.info.phone})`, 14, currentY);
                
                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(100);
                currentY += 6;
                doc.text(`Address: ${item.info.address || 'N/A'} | Current Balance: Rs. ${item.info.debtAmount.toFixed(2)}`, 14, currentY);

                // පාරිභෝගිකයාගේ ගනුදෙනු වගුව
                autoTable(doc, {
                    startY: currentY + 4,
                    head: [['Date', 'Type', 'Amount']],
                    body: item.history.map(trx => [
                        new Date(trx.date).toLocaleDateString('en-GB'),
                        trx.type === 'add' ? 'Added' : 'Settled',
                        `Rs. ${trx.amount.toFixed(2)}`
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [51, 65, 85] },
                    margin: { left: 14, right: 14 },
                    styles: { fontSize: 8 }
                });

                // ඊළඟ පාරිභෝගිකයා සඳහා පරතරය තැබීම
                currentY = doc.lastAutoTable.finalY + 15;
            });

            doc.save(`MASTER_BACKUP_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error(err);
            alert("Master Backup එක සැකසීම අසාර්ථකයි.");
        } finally {
            setIsGeneratingMaster(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden text-left font-sans">
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-black text-blue-400 uppercase tracking-tighter">SSK Manager</h1>
                        <p className="text-[10px] text-blue-300/50 font-bold uppercase tracking-widest mt-1">Professional Edition</p>
                    </div>
                    <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
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

            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 bg-slate-100 rounded-xl" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-800">වාර්තා ලබාගැනීම</h2>
                            <p className="text-slate-500 text-xs font-medium">ගනුදෙනු සහ පද්ධති උපස්ථ (Backups)</p>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 space-y-8">
                    {/* 1. Date Range Report Card */}
                    <div className="bg-white w-full max-w-2xl p-6 md:p-10 rounded-[32px] border border-slate-100 shadow-sm mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><FileText size={24} /></div>
                            <h3 className="text-lg font-black text-slate-800 uppercase">කාලසීමාව අනුව වාර්තා</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800" />
                            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800" />
                        </div>
                        <button onClick={handleGeneratePDF} disabled={isGenerating || !fromDate || !toDate} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">
                            {isGenerating ? "සකසමින්..." : "PDF වාර්තාව බාගත කරන්න"}
                        </button>
                    </div>

                    {/* 2. Master Backup Card (ඔයා ඉල්ලපු කොටස) */}
                    <div className="bg-white w-full max-w-2xl p-6 md:p-10 rounded-[32px] border border-blue-100 shadow-sm mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-slate-900 text-white rounded-2xl"><Database size={24} /></div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase">සම්පූර්ණ පද්ධති උපස්ථය</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Master Database Backup</p>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-8 font-medium">
                            මෙමඟින් සියලුම පාරිභෝගිකයින්ගේ විස්තර සහ ඔවුන්ගේ මුළු ගනුදෙනු ඉතිහාසය එකම වාර්තාවක් ලෙස ලබාගත හැක.
                        </p>
                        <button 
                            onClick={handleGenerateMasterPDF}
                            disabled={isGeneratingMaster}
                            className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                                isGeneratingMaster ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-black active:scale-95'
                            }`}
                        >
                            {isGeneratingMaster ? "Backing up..." : <><Download size={24} /> MASTER BACKUP බාගත කරන්න</>}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

const LogOut = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

export default ReportsPage;