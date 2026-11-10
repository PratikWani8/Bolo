import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, PhoneCall, ExternalLink, ShieldAlert, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-saffron flex items-center justify-center text-white">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white font-indic tracking-tight">बोलो (BOLO)</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your Voice. Your Language. Your Government Services.
              <br />
              ग्रामीण आणि निमशहरी नागरिकांना कोणत्याही मध्यस्थांशिवाय सत्यापित सरकारी योजनांची माहिती सहज उपलब्ध करून देणारे आवाज-आधारित व्यासपीठ.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <Award className="w-4 h-4 shrink-0" />
              <span>Digital Public Service Initiative 2026</span>
            </div>
          </div>

          {/* Column 2: Official Government Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              अधिकृत शासकीय स्त्रोत (Official Portals)
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="https://myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-saffron flex items-center gap-1.5 transition"
                >
                  <span>myScheme Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://services.india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-saffron flex items-center gap-1.5 transition"
                >
                  <span>National Services Portal (india.gov.in)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://web.umang.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-saffron flex items-center gap-1.5 transition"
                >
                  <span>UMANG App Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-saffron flex items-center gap-1.5 transition"
                >
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://nha.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-saffron flex items-center gap-1.5 transition"
                >
                  <span>National Health Authority (PM-JAY)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              महत्त्वाच्या हेल्पलाईन (Helplines)
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">1800-180-1551</div>
                  <div className="text-xs text-slate-400">किसान कॉल सेंटर (KCC Agriculture)</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">14555</div>
                  <div className="text-xs text-slate-400">आयुष्मान भारत राष्ट्रीय आरोग्य हेल्पलाईन</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">181</div>
                  <div className="text-xs text-slate-400">महिला मदत कक्ष व लाडकी बहीण सहाय्य</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Navigation & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              द्रुत दुवे (Quick Links)
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/assistant" className="hover:text-white transition">
                  आवाज सहाय्यक (Voice Assistant)
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-white transition">
                  सर्व योजना शोधा (Scheme Explorer)
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-white transition">
                  पात्रता तपासा (Eligibility Checker)
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-white transition">
                  कागदपत्रे तपासणी (Document Checklist)
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="hover:text-white transition">
                  स्वयंसेवक कक्ष (Volunteer Assistance)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="border-t border-slate-800 pt-8 mt-8 text-xs text-slate-500 leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p>
            <strong>महत्त्वाची सूचना / Disclaimer:</strong> बोलो (BOLO) हे व्यासपीठ नागरिकांना मार्गदर्शन करण्यासाठी अधिकृत शासकीय परिपत्रके व संकेतस्थळांनुसार माहिती सादर करते. BOLO थेट कोणत्याही योजनेचा अर्ज मंजूर किंवा नामंजूर करत नाही. अंतिम निर्णय संबंधित शासकीय विभाग किंवा सक्षम अधिकाऱ्यांच्या अधिकारात असतो. कधीही आपला बँक पिन, ओटीपी किंवा गुप्त माहिती कोणाशीही शेअर करू नका.
          </p>
        </div>

        <div className="text-center text-xs text-slate-600 mt-8 pt-6 border-t border-slate-800/60">
          © {new Date().getFullYear()} BOLO – Voice Help for Everyday Government Services. Built with public-interest AI.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
