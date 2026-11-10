import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useConnectivity } from '../../context/ConnectivityContext';
import LanguageSelector from './LanguageSelector';
import {
  Mic,
  BookOpen,
  CheckCircle2,
  FileText,
  PhoneCall,
  User,
  LogOut,
  Menu,
  X,
  Wifi,
  WifiOff,
  Shield,
  HeartHandshake,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isVolunteer, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { isOnline } = useConnectivity();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/assistant', label: 'बोलून विचारा', english: 'Voice Help', icon: Mic },
    { to: '/schemes', label: 'सरकारी योजना', english: 'Schemes', icon: BookOpen },
    { to: '/eligibility', label: 'पात्रता तपासा', english: 'Eligibility', icon: CheckCircle2 },
    { to: '/documents', label: 'कागदपत्रे', english: 'Documents', icon: FileText },
    { to: '/helplines', label: 'हेल्पलाईन', english: 'Helplines', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-900/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-900 via-teal-800 to-saffron flex items-center justify-center text-white shadow-md shadow-teal-900/20 group-hover:scale-105 transition-transform">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-teal-900 font-indic">बोलो</span>
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-saffron/15 text-saffron-700">
                  BOLO
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-none">
                Voice Help for Govt Services
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-800 text-white shadow-sm shadow-teal-900/20'
                      : 'text-slate-700 hover:text-teal-900 hover:bg-teal-50/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-300' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Connectivity, Language, Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Connectivity Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={isOnline ? 'Connected to National Public Services' : 'Offline Mode Active'}
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ऑनलाइन</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600" />
                  <span>ऑफलाइन</span>
                </>
              )}
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {isVolunteer && (
                  <Link
                    to="/volunteer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>स्वयंसेवक</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>प्रशासक</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-teal-900 hover:bg-teal-50 rounded-xl transition"
                >
                  लॉगिन
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-saffron hover:bg-saffron-600 text-white shadow-sm transition"
                >
                  नोंदणी करा
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector compact />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
                  isActive ? 'bg-teal-800 text-white' : 'text-slate-800 hover:bg-teal-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-saffron-300' : 'text-slate-500'}`} />
                <div>
                  <div>{link.label}</div>
                  <div className={`text-xs ${isActive ? 'text-teal-200' : 'text-slate-400'}`}>
                    {link.english}
                  </div>
                </div>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </div>
                  <span className="text-xs uppercase px-2 py-0.5 rounded bg-white text-slate-600 font-bold">
                    {user.role}
                  </span>
                </Link>
                {isVolunteer && (
                  <Link
                    to="/volunteer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-purple-700 bg-purple-50 rounded-xl"
                  >
                    स्वयंसेवक डॅशबोर्ड (Volunteer Mode)
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-teal-800 bg-teal-50 rounded-xl"
                  >
                    प्रशासक नियंत्रण (Admin Panel)
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>बाहेर पडा (Logout)</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-3 rounded-xl border border-teal-800 text-teal-900 font-bold"
                >
                  लॉगिन
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-3 rounded-xl bg-saffron text-white font-bold"
                >
                  नोंदणी करा
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
