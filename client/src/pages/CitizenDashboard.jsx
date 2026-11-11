import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useConnectivity } from '../context/ConnectivityContext';
import VoiceMicButton from '../components/voice/VoiceMicButton';
import LanguageSelector from '../components/common/LanguageSelector';
import VerifiedBadge from '../components/common/VerifiedBadge';
import { schemesAPI, aiAPI } from '../services/api';
import { SCHEME_CATEGORIES } from '../utils/constants';
import {
  Mic,
  ArrowRight,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Volume2,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  Wifi,
  WifiOff,
} from 'lucide-react';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const { currentLang, t } = useLanguage();
  const { isOnline } = useConnectivity();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Suggested quick voice query chips
  const suggestedChips = [
    'मला पीएम किसान सन्मान निधीचे पैसे कसे मिळतील?',
    'लाडकी बहीण योजनेची पात्रता काय आहे?',
    'आयुष्मान भारत गोल्डन कार्ड कसे काढायचे?',
    'ग्रामीण भागात घर बांधण्यासाठी किती अनुदान मिळते?',
    'विश्वकर्मा योजनेत टूलकिटसाठी किती पैसे मिळतात?',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await schemesAPI.getSchemes({ limit: 4 });
        if (res.data?.schemes) {
          setSchemes(res.data.schemes);
        }
      } catch (err) {
        console.warn('Dashboard data fetch notice:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartVoice = () => {
    navigate('/assistant?autostart=true');
  };

  const handleSelectQueryChip = (queryText) => {
    navigate(`/assistant?q=${encodeURIComponent(queryText)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Citizen Welcome Card with Language & Connectivity Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-teal-900 to-teal-800 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-saffron text-white font-bold">
              नागरिक कक्ष
            </span>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isOnline ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/60 text-amber-300'
              }`}
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isOnline ? 'इंटरनेट कनेक्टेड' : 'ऑफलाइन मोड'}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-indic">
            नमस्कार, {user ? user.name : 'नागरिक मित्र'}!
          </h1>
          <p className="text-teal-200 text-sm mt-0.5">
            आपल्या भाषेत बोला आणि खात्रीशीर सरकारी योजनांची माहिती तात्काळ मिळवा.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
        </div>
      </div>

      {/* Flagship Voice Interaction Module (Primary Visual Element) */}
      <div className="relative rounded-3xl bg-white border border-teal-200 p-8 sm:p-12 shadow-xl text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 via-transparent to-ivory opacity-70 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/15 text-saffron-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-saffron" />
            <span>एक टॅप आवाज सहाय्यता (Voice Assistance)</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-indic tracking-tight">
            माईक दाबा आणि प्रश्न विचारा
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            टाईप करण्याची अजिबात गरज नाही. मोठ्या बटनावर स्पर्श करून आपल्या मातृभाषेत बोला:
          </p>

          {/* Central Microphone Button */}
          <VoiceMicButton
            size="large"
            onClick={handleStartVoice}
            label="बोलण्यासाठी येथे स्पर्श करा"
            subtitle="Tap to speak in your language"
          />

          {/* Quick Query Suggestion Chips */}
          <div className="pt-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              किंवा या लोकप्रिय प्रश्नांवर टॅप करा:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectQueryChip(chip)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 text-xs font-semibold border border-slate-200 transition text-left"
                >
                  💬 {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories Shortcuts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 font-indic">
            योजनांची क्षेत्रे (Browse by Category)
          </h3>
          <Link to="/schemes" className="text-sm font-bold text-teal-800 hover:underline">
            सर्व पहा →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SCHEME_CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/schemes?category=${cat.id}`}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
            >
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cat.color}`}>
                {cat.labelEn}
              </span>
              <span className="text-xs font-bold text-slate-800 font-indic group-hover:text-teal-900">
                {cat.labelMr}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Schemes & Quick Checklist Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Schemes Grid (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-saffron" />
              <h3 className="text-xl font-black text-slate-900 font-indic">
                लोकप्रिय सरकारी योजना (Popular Schemes)
              </h3>
            </div>
            <Link to="/schemes" className="text-sm font-bold text-teal-800 hover:underline">
              सर्व योजना →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schemes.map((scheme) => (
              <div
                key={scheme._id || scheme.slug}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {scheme.category}
                    </span>
                    <VerifiedBadge date={scheme.lastVerifiedAt} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-indic line-clamp-2">
                    {scheme.translations?.mr?.name || scheme.name}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {scheme.translations?.mr?.description || scheme.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    राज्य: {scheme.state}
                  </span>
                  <Link
                    to={`/assistant?q=${encodeURIComponent(scheme.name)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-900"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-saffron" />
                    <span>ऐका व विचारा</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tools & Helplines (1 Column) */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 font-indic">
            जलद साधने (Citizen Quick Tools)
          </h3>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <Link
              to="/eligibility"
              className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 hover:bg-teal-100/80 transition text-teal-900"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold font-indic">पात्रता तपासा</div>
                <div className="text-xs text-teal-700">५ सोपे प्रश्न देऊन स्वतःची पात्रता जाणून घ्या</div>
              </div>
            </Link>

            <Link
              to="/documents"
              className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 transition text-amber-900"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold font-indic">कागदपत्रे तपासणी यादी</div>
                <div className="text-xs text-amber-700">अर्ज करताना लागणाऱ्या कागदपत्रांची माहिती</div>
              </div>
            </Link>

            <Link
              to="/helplines"
              className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100/80 transition text-rose-900"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold font-indic">२४x७ शासकीय हेल्पलाईन</div>
                <div className="text-xs text-rose-700">टोल-फ्री शासकीय क्रमांक व संपर्क</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
