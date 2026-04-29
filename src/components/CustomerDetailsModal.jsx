import React from 'react';
import { X, Phone, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const CustomerDetailsModal = ({ isOpen, customer, history, onClose, onDelete }) => {
    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800">පාරිභෝගික විස්තර</h3>
                    <button 
                        onClick={onClose} 
                        className="p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-all"
                    >
                        <X size={20}/>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">නම</p>
                            <p className="text-sm font-black text-slate-800">{customer.name}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">දුරකථනය</p>
                            <p className="text-sm font-black text-slate-800 flex items-center gap-1">
                                <Phone size={14} className="text-slate-400" /> {customer.phone}
                            </p>
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">දැනට මුළු ණය</p>
                            <p className="text-2xl font-black text-red-600">Rs. {customer.debtAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* ✅ ගනුදෙනු ඉතිහාසය (Transaction History) */}
                    <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock size={16} className="text-slate-400" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">පසුගිය ගනුදෙනු</p>
                        </div>
                        
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {history && history.length > 0 ? (
                                history.map((tx) => (
                                    <div key={tx._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${tx.type === 'add' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {tx.type === 'add' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-700">
                                                    {tx.type === 'add' ? 'ණය එකතු කිරීමක්' : 'ණය පියවීමක්'}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-medium">
                                                    {new Date(tx.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                        <p className={`text-sm font-black ${tx.type === 'add' ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {tx.type === 'add' ? '+' : '-'} {tx.amount.toFixed(2)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-xs text-slate-400 font-medium">ගනුදෙනු කිසිවක් නැත</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <button 
                        onClick={() => onDelete(customer._id)}
                        className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <X size={18} className="group-hover:rotate-90 transition-transform" /> 
                        පාරිභෝගිකයා ඉවත් කරන්න
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsModal;