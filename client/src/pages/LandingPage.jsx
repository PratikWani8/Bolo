import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SCHEME_CATEGORIES, SUPPORTED_LANGUAGES } from '../utils/constants';
import {
  Mic,
  ShieldCheck,
  Globe2,
  WifiOff,
  ArrowRight,
  Sprout,
  HeartPulse,
  HeartHandshake,
  Home,
  Landmark,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

const LandingPage = () => {
  const { t } = useLanguage();

  const howItWorksSteps = [
    {
      step: '१',
      titleMr: 'माईक दाबा आणि बोला',
      titleEn: 'Speak in Your Mother Tongue',
      descMr: 'कोणतेही टाईप न करता आपल्या भाषेत (उदा. मराठी किंवा हिंदी) प्रश्न विचारा.',
      icon: Mic,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      step: '२',
      titleMr: 'AI ओळख आणि पडताळणी',
      titleEn: 'Voice & Intent Detection',
      descMr: 'AI भाषा ओळखतो आणि केंद्र व राज्य शासनाच्या अधिकृत परिपत्रकांमध्ये माहिती शोधतो.',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      step: '३',
      titleMr: 'सोपे उत्तर ऐका आणि वाचा',
      titleEn: 'Simple Grounded Answer',
      descMr: 'कोणत्याही किचकट शब्दांशिवाय पात्रता, कागदपत्रे आणि मिळणारे पैसे समजून घ्या.',
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      step: '४',
      titleMr: 'थेट अधिकृत अर्ज करा',
      titleEn: 'Official Link & Helpline',
      descMr: 'मध्यस्थांशिवाय अधिकृत सरकारी पोर्टल लिंक आणि टोल-फ्री हेल्पलाईन मिळवा.',
      icon: PhoneCall,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.teal.100),theme(colors.ivory.DEFAULT))] opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Official Gov Tech Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-teal-200 shadow-sm text-xs sm:text-sm font-semibold text-teal-900 animate-in fade-in zoom-in-95 duration-200">
            <span className="w-2.5 h-2.5 rounded-full bg-saffron animate-pulse" />
            <span>Digital Public Infrastructure for Welfare Schemes • भारत सरकार</span>
          </div>

          {/* Main Title & Tagline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none font-indic">
              आपला आवाज. आपली भाषा.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-900 via-teal-700 to-saffron">
                आपल्या सरकारी सेवा.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              BOLO – ग्रामीण आणि निमशहरी नागरिकांसाठी सोपी, खात्रीशीर आणि मध्यस्थ-मुक्त सरकारी आवाज सहाय्यता. टाईप न करता फक्त बोलून माहिती मिळवा.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-900 to-teal-800 text-white font-bold text-lg shadow-xl shadow-teal-900/20 hover:from-teal-800 hover:to-teal-700 hover:scale-105 transition-all group"
            >
              <Mic className="w-6 h-6 text-saffron group-hover:animate-bounce" />
              <span>आता बोलून विचारा (Speak Now)</span>
              <ArrowRight className="w-5 h-5 text-teal-300" />
            </Link>

            <Link
              to="/schemes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-800 font-bold text-lg border border-slate-200 shadow-md hover:bg-slate-50 transition"
            >
              <span>सर्व योजना शोधा (Explore Schemes)</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-teal-900/10 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">१००% अधिकृत स्त्रोत</div>
                <div className="text-[11px] text-slate-500">myScheme व GR वर आधारित</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
              <Globe2 className="w-6 h-6 text-teal-700 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">१०+ भारतीय भाषा</div>
                <div className="text-[11px] text-slate-500">मराठी, हिंदी, इंग्रजी, इत्यादी</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
              <WifiOff className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">कमी इंटरनेट अनुकूल</div>
                <div className="text-[11px] text-slate-500">ऑफलाइन कॅशे व PWA सक्षम</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
              <PhoneCall className="w-6 h-6 text-saffron shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">थेट हेल्पलाईन डायल</div>
                <div className="text-[11px] text-slate-500">एका टॅपने शासकीय मदत</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How BOLO Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold text-saffron uppercase tracking-widest">
            अत्यंत सोपी कार्यपद्धती
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 font-indic">
            बोलो कसे कार्य करते? (How BOLO Works)
          </h3>
          <p className="text-slate-600">
            ग्रामीण भागातील प्रत्येक नागरिकाला कोणत्याही किचकट प्रक्रियेविना सहज माहिती मिळावी यासाठी ४ पायऱ्या:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-200 font-indic">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-indic">
                    {item.titleMr}
                  </h4>
                  <div className="text-xs text-teal-800 font-semibold">{item.titleEn}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.descMr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Example Voice Interaction Carousel / Demonstration Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-saffron/10 rounded-full blur-3xl -z-0" />

          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between border-b border-teal-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-wider text-teal-200">
                  थेट उदाहरण (Live Example Demonstration)
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-teal-800 text-teal-200 font-semibold">
                मराठी आवाज सहाय्य
              </span>
            </div>

            {/* User Speech Bubble */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-saffron text-white flex items-center justify-center font-bold shrink-0">
                शेतकरी
              </div>
              <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl rounded-tl-none max-w-xl">
                <div className="text-xs text-saffron-300 font-semibold mb-1">नागरिकाने विचारले (Citizen Voice):</div>
                <p className="text-lg font-medium text-white font-indic">
                  "मला प्रधानमंत्री किसान योजनेचा लाभ कसा मिळेल?"
                </p>
              </div>
            </div>

            {/* BOLO Voice Response Bubble */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                BOLO
              </div>
              <div className="bg-teal-900/80 border border-teal-700/80 p-5 rounded-2xl rounded-tl-none max-w-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-teal-300 font-semibold">
                    सत्यापित उत्तर (Grounded AI Audio Response):
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">
                    ९४% अचूकता
                  </span>
                </div>
                <p className="text-base sm:text-lg text-teal-50 font-indic leading-relaxed">
                  "प्रधानमंत्री किसान सन्मान निधी योजनेअंतर्गत स्वतःच्या नावावर शेतजमीन असलेल्या शेतकरी कुटुंबाला दरवर्षी ₹६,००० (३ हप्त्यांमध्ये ₹२,०००) थेट बँक खात्यात मिळतात. यासाठी आधार कार्ड, ७/१२ उतारा आणि आधार-लिंक्ड बँक पासबुक आवश्यक आहे."
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="bg-teal-950 px-2.5 py-1 rounded-md text-teal-300 font-mono">
                    स्त्रोत: pmkisan.gov.in
                  </span>
                  <span className="bg-teal-950 px-2.5 py-1 rounded-md text-emerald-300">
                    हेल्पलाईन: 155261
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron hover:bg-saffron-600 text-white font-bold transition shadow-lg"
              >
                <span>स्वतः चाचणी घ्या (Try Voice Assistant Now)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welfare Schemes Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-xs font-bold text-saffron uppercase tracking-widest">
              कल्याणकारी क्षेत्रे
            </h2>
            <h3 className="text-3xl font-black text-slate-900 font-indic">
              सरकारी सेवा विभाग (Public Service Categories)
            </h3>
          </div>
          <Link
            to="/schemes"
            className="inline-flex items-center gap-2 font-bold text-teal-800 hover:text-teal-900 transition"
          >
            <span>सर्व योजनांची यादी पहा</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SCHEME_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/schemes?category=${cat.id}`}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-500 transition group flex flex-col justify-between"
            >
              <div>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold ${cat.color} mb-3`}>
                  {cat.labelEn}
                </span>
                <h4 className="text-base font-bold text-slate-800 font-indic group-hover:text-teal-800 transition">
                  {cat.labelMr}
                </h4>
              </div>
              <div className="text-xs text-slate-400 mt-4 flex items-center justify-between">
                <span>माहिती मिळवा</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Supported Languages Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-indic">
              आपल्या मातृभाषेत विचारा (Supported Languages)
            </h3>
            <p className="text-sm text-slate-600">
              BOLO विविध भारतीय प्रादेशिक भाषांमधील बोलीभाषा व उच्चार समजून घेऊन तात्काळ उत्तर देण्यास सक्षम आहे:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className="p-4 rounded-2xl bg-ivory border border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-teal-400 transition"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-lg font-bold text-slate-800">{lang.name}</span>
                <span className="text-xs text-slate-500">{lang.englishName}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
