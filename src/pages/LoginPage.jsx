import React, { useState } from 'react';
import { Phone, Lock, ArrowRight } from 'lucide-react';
import bgImage from '../assets/bg.jpg'; // පින්තූරය import කරගන්න

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div 
      className="min-h-screen flex flex-col justify-center px-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }} // Background එකට පින්තූරය සෙට් කිරීම
    >
      {/* Background Overlay - පින්තූරය උඩින් පොඩි නිල් පාට ගතියක් දෙන්න */}
      <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px]"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-8 shadow-2xl rounded-[40px] border border-white/50">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-blue-900 tracking-tight">
              Smart Shop
            </h2>
            <p className="text-blue-700/80 font-medium">නැවත සාදරයෙන් පිළිගනිමු!</p>
          </div>

          <form className="space-y-5">
            <div>
              <div className="relative">
                <Phone className="absolute left-4 top-4 h-5 w-5 text-blue-500" />
                <input
                  type="text"
                  placeholder="දුරකථන අංකය"
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-blue-300"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-blue-500" />
                <input
                  type="password"
                  placeholder="මුරපදය"
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-blue-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center group">
              ඇතුළු වන්න <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
              අලුත් ගිණුමක් ආරම්භ කරන්න
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-white/80 text-sm font-medium drop-shadow-md">
          © 2026 Smart Shop Keeper
        </p>
      </div>
    </div>
  );
};

export default LoginPage;