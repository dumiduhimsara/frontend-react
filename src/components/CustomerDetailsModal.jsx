import React from 'react';
import { X, Phone } from 'lucide-react';

const CustomerDetailsModal = ({ isOpen, customer, onClose, onDelete }) => {
    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-200">
                
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
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">නම</p>
                        <p className="text-lg font-black text-slate-800">{customer.name}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">දුරකථනය</p>
                        <p className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <Phone size={16} className="text-slate-400" /> {customer.phone}
                        </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">දැනට ණය මුදල</p>
                        <p className="text-xl font-black text-red-600">Rs. {customer.debtAmount.toFixed(2)}</p>
                    </div>
                </div>

                {/* Modal Footer (Delete Button) */}
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