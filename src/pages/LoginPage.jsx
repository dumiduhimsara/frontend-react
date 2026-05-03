import React, { useState } from 'react';
import { Phone, Lock, ArrowRight, Loader2 } from 'lucide-react'; // ✅ Loader2 එක් කළා
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import bgImage from '../assets/bg.webp';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ✅ Loading state එකක් එක් කළා
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // ✅ Loading ආරම්භය
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${apiUrl}/login-shop`, { phone, password });

      if (res.status === 200) {
        localStorage.setItem("merchantId", res.data.merchant.id);
        localStorage.setItem("merchantName", res.data.merchant.ownerName);
        localStorage.setItem("shopName", res.data.merchant.shopName);
        
        // ✅ සාර්ථක නම් Alert එකක් නැතිව කෙළින්ම Dashboard එකට යයි
        navigate('/dashboard'); 
      }
    } catch (err) {
      // ✅ වැරැද්දක් වුණොත් පමණක් Alert එක පෙන්වයි
      alert(err.response?.data?.message || "Login අසාර්ථකයි. නැවත උත්සාහ කරන්න.");
    } finally {
      setIsLoading(false); // ✅ Loading අවසානය
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center px-6 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-blue-900/10"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/40 backdrop-blur-md py-10 px-8 shadow-2xl rounded-[40px] border border-white/30 ring-1 ring-black/5">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-blue-950 tracking-tight drop-shadow-sm">
              Smart Shop
            </h2>
            <p className="text-blue-900/80 font-bold text-sm">නැවත සාදරයෙන් පිළිගනිමු!</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <div className="relative group">
                <Phone className="absolute left-4 top-4 h-5 w-5 text-blue-700 transition-colors group-focus-within:text-blue-900" />
                <input
                  type="text"
                  placeholder="දුරකථන අංකය"
                  className="w-full pl-12 pr-4 py-4 bg-white/40 border border-white/40 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-blue-800/50 text-blue-950 font-semibold"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isLoading} // ✅ Loading වෙද්දී Input disable කිරීම
                />
              </div>
            </div>

            <div>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-blue-700 transition-colors group-focus-within:text-blue-900" />
                <input
                  type="password"
                  placeholder="මුරපදය"
                  className="w-full pl-12 pr-4 py-4 bg-white/40 border border-white/40 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-blue-800/50 text-blue-950 font-semibold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading} // ✅ Loading වෙද්දී Input disable කිරීම
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading} // ✅ Loading වෙද්දී බටන් එක disable කිරීම
              className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-lg font-bold shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> ඇතුළු වෙමින්...
                </>
              ) : (
                <>
                  ඇතුළු වන්න <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/20 pt-6">
            <button 
              onClick={() => navigate('/register')} 
              disabled={isLoading}
              className="text-blue-900 font-extrabold hover:text-blue-700 transition-colors drop-shadow-sm disabled:opacity-50"
            >
              අලුත් ගිණුමක් ආරම්භ කරන්න
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-blue-950/70 text-xs font-bold uppercase tracking-widest drop-shadow-sm">
          © 2026 Smart Shop Keeper
        </p>
      </div>
    </div>
  );
};

export default LoginPage;