import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { eligibilityAPI } from '../services/api';
import { INDIAN_STATES } from '../utils/constants';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Info,
} from 'lucide-react';

const EligibilityCheckerPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    age: '',
    state: 'Maharashtra',
    gender: 'All',
    occupation: '',
    annualIncome: '',
    isFarmer: false,
  });

  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState(null);

  const questions = [
    {
      id: 'state',
      titleMr: 'आपण कोणत्या राज्यात राहता?',
      titleEn: 'Which state do you live in?',
      type: 'select',
      options: INDIAN_STATES.filter((s) => s !== 'All India'),
    },
    {
      id: 'age',
      titleMr: 'आपले वय किती वर्षे आहे?',
      titleEn: 'What is your current age?',
      type: 'number',
      placeholder: 'उदा. 42',
    },
    {
      id: 'gender',
      titleMr: 'लिंग निवडा (Gender):',
      titleEn: 'Select Gender:',
      type: 'radio',
      options: [
        { label: 'महिला (Female)', value: 'Female' },
        { label: 'पुरुष (Male)', value: 'Male' },
        { label: 'इतर (Other)', value: 'All' },
      ],
    },
    {
      id: 'isFarmer',
      titleMr: 'आपण किंवा आपले कुटुंब शेती करते का?',
      titleEn: 'Are you or your family engaged in farming/cultivation?',
      type: 'boolean',
    },
    {
      id: 'occupation',
      titleMr: 'आपला मुख्य व्यवसाय कोणता आहे?',
      titleEn: 'What is your primary occupation?',
      type: 'text',
      placeholder: 'उदा. शेतकरी, सुतार, गवंडी, शिलाई कामगार, कामगार, गृहिणी...',
    },
    {
      id: 'annualIncome',
      titleMr: 'आपल्या कुटुंबाचे अंदाजे वार्षिक उत्पन्न किती आहे?',
      titleEn: 'Approximate annual household income?',
      type: 'income_select',
      options: [
        { label: '₹१ लाखांपेक्षा कमी (Below ₹1 Lakh)', value: 90000 },
        { label: '₹१ लाख ते ₹२.५० लाख (₹1L - ₹2.5L)', value: 200000 },
        { label: '₹२.५० लाख ते ₹५ लाख (₹2.5L - ₹5L)', value: 400000 },
        { label: '₹५ लाखांपेक्षा जास्त (Above ₹5 Lakh)', value: 600000 },
      ],
    },
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitEvaluation();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitEvaluation = async () => {
    setLoading(true);
    try {
      const res = await eligibilityAPI.check({
        age: answers.age ? Number(answers.age) : null,
        state: answers.state,
        gender: answers.gender,
        occupation: answers.occupation,
        annualIncome: answers.annualIncome ? Number(answers.annualIncome) : null,
        isFarmer: Boolean(answers.isFarmer),
      });

      if (res.data?.assessment) {
        setAssessment(res.data.assessment);
      }
    } catch (err) {
      console.error('Eligibility evaluation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAssessment(null);
    setCurrentStep(0);
    setAnswers({
      age: '',
      state: 'Maharashtra',
      gender: 'All',
      occupation: '',
      annualIncome: '',
      isFarmer: false,
    });
  };

  const activeQ = questions[currentStep];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-saffron" />
          <span>Conversational Eligibility Engine</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-indic tracking-tight">
          सरकारी योजना पात्रता तपासणी
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          ५-६ सोप्या प्रश्नांची उत्तरे द्या. BOLO आपल्या माहितीनुसार कोणत्या योजनांचे लाभ मिळू शकतात ते शोधेल.
        </p>
      </div>

      {!assessment ? (
        /* Step-by-Step Question Card */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>
                प्रश्न {currentStep + 1} / {questions.length}
              </span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% पूर्ण</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-teal-800 transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Question Title */}
          <div className="space-y-2 text-center py-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-indic">
              {activeQ.titleMr}
            </h2>
            <p className="text-sm text-slate-400 font-medium">{activeQ.titleEn}</p>
          </div>

          {/* Active Question Input Controls */}
          <div className="max-w-md mx-auto space-y-4">
            {activeQ.type === 'select' && (
              <select
                value={answers[activeQ.id]}
                onChange={(e) => setAnswers({ ...answers, [activeQ.id]: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-base font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700 bg-slate-50"
              >
                {activeQ.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {activeQ.type === 'number' && (
              <input
                type="number"
                value={answers[activeQ.id]}
                onChange={(e) => setAnswers({ ...answers, [activeQ.id]: e.target.value })}
                placeholder={activeQ.placeholder}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-teal-700 bg-slate-50"
              />
            )}

            {activeQ.type === 'radio' && (
              <div className="grid grid-cols-1 gap-2.5">
                {activeQ.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswers({ ...answers, [activeQ.id]: opt.value })}
                    className={`p-4 rounded-2xl text-left font-bold text-sm border transition flex items-center justify-between ${
                      answers[activeQ.id] === opt.value
                        ? 'border-teal-700 bg-teal-50 text-teal-900 ring-2 ring-teal-700/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {answers[activeQ.id] === opt.value && (
                      <CheckCircle2 className="w-5 h-5 text-teal-700" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {activeQ.type === 'boolean' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, [activeQ.id]: true })}
                  className={`p-5 rounded-2xl text-center font-bold text-base border transition ${
                    answers[activeQ.id] === true
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🌾 होय (Yes, Farmer)
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, [activeQ.id]: false })}
                  className={`p-5 rounded-2xl text-center font-bold text-base border transition ${
                    answers[activeQ.id] === false
                      ? 'border-slate-700 bg-slate-100 text-slate-900 ring-2 ring-slate-400/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  नाही (No, Other)
                </button>
              </div>
            )}

            {activeQ.type === 'text' && (
              <input
                type="text"
                value={answers[activeQ.id]}
                onChange={(e) => setAnswers({ ...answers, [activeQ.id]: e.target.value })}
                placeholder={activeQ.placeholder}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-teal-700 bg-slate-50"
              />
            )}

            {activeQ.type === 'income_select' && (
              <div className="grid grid-cols-1 gap-2.5">
                {activeQ.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswers({ ...answers, [activeQ.id]: opt.value })}
                    className={`p-3.5 rounded-2xl text-left font-bold text-sm border transition flex items-center justify-between ${
                      answers[activeQ.id] === opt.value
                        ? 'border-teal-700 bg-teal-50 text-teal-900 ring-2 ring-teal-700/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {answers[activeQ.id] === opt.value && (
                      <CheckCircle2 className="w-5 h-5 text-teal-700" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>मागे</span>
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition"
            >
              <span>{currentStep === questions.length - 1 ? 'पात्रता तपासा' : 'पुढील प्रश्न'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">तपासणी निकाल</span>
              <h3 className="text-xl font-black text-slate-900 font-indic">
                आपल्यासाठी {assessment.eligibleCount} संभाव्य योजना उपलब्ध आहेत
              </h3>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>पुन्हा तपासा</span>
            </button>
          </div>

          {/* Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>प्राथमिक डिजिटल मार्गदर्शन:</strong> हा निकाल संगणकीय पडताळणीवर आधारित प्राथमिक सल्ला आहे. अधिकृत मंजूरी सक्षम शासकीय प्राधिकाऱ्यांच्या मूळ कागदपत्र तपासणीनंतरच दिली जाते.
            </span>
          </div>

          {/* Eligible Schemes List */}
          <div className="space-y-4">
            {assessment.eligibleSchemes.map((res, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-md space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1 inline-block">
                      ✓ संभाव्य पात्र (Potentially Eligible)
                    </span>
                    <h4 className="text-xl font-bold text-slate-900 font-indic">
                      {res.schemeName}
                    </h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 font-semibold text-slate-600">
                    {res.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">पूर्ण झालेले निकष:</div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {res.satisfiedCriteria?.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/assistant?q=${encodeURIComponent(res.schemeName)}`}
                    className="text-xs font-bold text-teal-800 hover:underline"
                  >
                    या योजनेबद्दल बोलून माहिती घ्या →
                  </Link>

                  {res.officialUrl && (
                    <a
                      href={res.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      <span>अधिकृत अर्ज लिंक</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityCheckerPage;
