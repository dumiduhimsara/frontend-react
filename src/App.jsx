import React, { useState } from 'react';
import axios from 'axios';

const API_URL = "https://test-backend-production-1021.up.railway.app";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, formData);
      alert(res.data.message || "Success!");
      if (!isLogin) setIsLogin(true); // Register වුණාම Login පේජ් එකට යවන්න
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <div style={{ border: '1px solid #ccc', padding: '30px', borderRadius: '10px', width: '350px', backgroundColor: '#fff' }}>
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input 
              type="text" placeholder="Full Name" 
              style={inputStyle}
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          )}
          <input 
            type="email" placeholder="Email" 
            style={inputStyle}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            type="password" placeholder="Password" 
            style={inputStyle}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          <button type="submit" style={buttonStyle}>{isLogin ? "Login" : "Register"}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default App;