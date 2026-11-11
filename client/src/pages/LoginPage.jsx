import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mic, Lock, Mail, ArrowRight, Shield, HeartHandshake, User, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || (role === 'admin' ? '/admin' : role === 'volunteer' ? '/volunteer' : '/dashboard');

  const handleRolePreset = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    if (selectedRole === 'citizen') {
      setEmail('citizen@bolo.gov.in');
      setPassword('BoloCitizen@123');
    } else if (selectedRole === 'volunteer') {
      setEmail('volunteer@bolo.gov.in');
      setPassword('BoloVolunteer@123');
    } else if (selectedRole === 'admin') {
      setEmail('admin@bolo.gov.in');
      setPassword('BoloAdmin@123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res && res.user) {
        if (res.user.role === 'admin') navigate('/admin');
        else if (res.user.role === 'volunteer') navigate('/volunteer');
        else navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'लॉगिन अयशस्वी. कृपया ईमेल आणि पासवर्ड तपासा.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md">
            <Mic className="w-6 h-6 text-saffron" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-indic">
            BOLO मध्ये प्रवेश करा
          </h2>
          <p className="text-sm text-slate-500">
            आपल्या खात्यात लॉगिन करा किंवा चाचणी खात्याची निवड करा
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => handleRolePreset('citizen')}
            className={`flex flex-col items-center py-2 rounded-xl text-xs font-bold transition ${
              role === 'citizen' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 mb-0.5" />
            <span>नागरिक</span>
          </button>
          <button
            type="button"
            onClick={() => handleRolePreset('volunteer')}
            className={`flex flex-col items-center py-2 rounded-xl text-xs font-bold transition ${
              role === 'volunteer' ? 'bg-white text-purple-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4 mb-0.5" />
            <span>स्वयंसेवक</span>
          </button>
          <button
            type="button"
            onClick={() => handleRolePreset('admin')}
            className={`flex flex-col items-center py-2 rounded-xl text-xs font-bold transition ${
              role === 'admin' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 mb-0.5" />
            <span>प्रशासक</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ईमेल पत्ता (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="उदा. citizen@bolo.gov.in"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              पासवर्ड (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Demo Credential Pill */}
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800">
            <span className="font-bold">चाचणी खाते (Pre-filled):</span> {email || 'वरील टॅब निवडा'}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-base shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{loading ? 'लॉगिन होत आहे...' : 'लॉगिन करा (Login)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          नवीन वापरकर्ता आहात?{' '}
          <Link to="/register" className="text-saffron font-bold hover:underline">
            येथे नोंदणी करा (Register Free)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
