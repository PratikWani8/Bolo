import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

const LanguageSelector = ({ compact = false }) => {
  const { currentLang, setLanguage, activeLanguageObj, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl font-medium transition-all border ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-white text-slate-700 border-slate-200 hover:border-teal-500'
            : 'px-3.5 py-2 text-sm bg-white/95 text-teal-900 border-teal-200 hover:border-teal-400 shadow-sm'
        }`}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-teal-700" />
        <span className="font-semibold">{activeLanguageObj.name}</span>
        <span className="text-xs text-slate-500 hidden sm:inline">({activeLanguageObj.englishName})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            भाषा निवडा (Select Language)
          </div>
          <div className="max-h-72 overflow-y-auto space-y-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition ${
                  currentLang === lang.code
                    ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{lang.flag}</span>
                  <div>
                    <div className="text-sm font-medium">{lang.name}</div>
                    <div className="text-xs text-slate-400">{lang.englishName}</div>
                  </div>
                </div>
                {currentLang === lang.code && <Check className="w-4 h-4 text-teal-700" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
