import React, { useState } from 'react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import {
  FileCheck,
  Volume2,
  CheckSquare,
  Square,
  Printer,
  Sparkles,
  Info,
  HelpCircle,
} from 'lucide-react';

const COMMON_GOVT_DOCS = [
  {
    id: 'aadhaar',
    name: 'आधार कार्ड (Aadhaar Card)',
    descriptionMr: 'सर्व सरकारी योजनांसाठी सर्वात महत्त्वाचे ओळख व पत्त्याचा पुरावा. मोबाईल नंबर लिंक असणे ई-केवायसी (e-KYC) साठी आवश्यक आहे.',
    howToGetMr: 'जवळच्या आधार सेवा केंद्र किंवा पोस्ट ऑफिसमध्ये जाऊन काढता येते.',
    isMandatory: true,
  },
  {
    id: 'ration_card',
    name: 'रेशन कार्ड (Ration Card - पिवळे / केशरी / अंत्योदय)',
    descriptionMr: 'कुटुंबातील सदस्यांची संख्या आणि आर्थिक स्तर (दारिद्र्यरेषेखालील किंवा केशरी) सिद्ध करणारा अधिकृत कौटुंबिक पुरावा.',
    howToGetMr: 'तहसील कार्यालय किंवा पुरवठा विभागाकडे अर्ज करून मिळते.',
    isMandatory: true,
  },
  {
    id: 'income_cert',
    name: 'तहसीलदारांचा उत्पन्नाचा दाखला (Income Certificate)',
    descriptionMr: 'कुटुंबाचे वार्षिक उत्पन्न ठरवून आर्थिक योजनांच्या लाभासाठी आवश्यक असणारे प्रमाणपत्र. (लाडकी बहीण योजनेसाठी पिवळे/केशरी रेशनकार्ड असल्यास स्वतंत्र दाखल्याची गरज नसते).',
    howToGetMr: 'आपले सरकार पोर्टल किंवा सेतू सुविधा केंद्रातून ३-५ दिवसात मिळतो.',
    isMandatory: true,
  },
  {
    id: 'land_records',
    name: '७/१२ उतारा व ८-अ (7/12 Extract & Land Records)',
    descriptionMr: 'शेतकऱ्यांच्या नावावर शेतजमीन असल्याची नोंद सिद्ध करणारा भूमी अभिलेख उतारा. पीएम किसान आणि कृषी योजनांसाठी बंधनकारक.',
    howToGetMr: 'mahabhumi.gov.in पोर्टलवरून डिजिटल स्वाक्षरीसह किंवा तलाठी कार्यालयातून मिळतो.',
    isMandatory: false,
  },
  {
    id: 'bank_passbook',
    name: 'आधार-लिंक्ड बँक खाते पासबुक (Aadhaar Seeded Bank Account)',
    descriptionMr: 'सरकारी अनुदानाचे पैसे थेट खात्यात (DBT) जमा होण्यासाठी बँक खात्याशी आधार व NPCI मॅपिंग असणे बंधनकारक आहे.',
    howToGetMr: 'आपल्या राष्ट्रीयीकृत किंवा ग्रामीण बँक शाखेत जाऊन आधार सीडिंग फॉर्म भरा.',
    isMandatory: true,
  },
  {
    id: 'domicile',
    name: 'अधिवास प्रमाणपत्र / रहिवासी दाखला (Domicile Certificate)',
    descriptionMr: 'आपण संबंधित राज्यात (उदा. महाराष्ट्र) सलग १५ वर्षे वास्तव्यास असल्याचे सिद्ध करणारा पुरावा.',
    howToGetMr: 'आपले सरकार केंद्र किंवा ग्रामपंचायत दाखल्यावर आधारित तहसीलदारांकडून मिळतो.',
    isMandatory: false,
  },
];

const DocumentChecklistPage = () => {
  const [checkedDocs, setCheckedDocs] = useState({});
  const { speak } = useSpeechSynthesis({ language: 'mr' });

  const toggleCheck = (id) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleVoiceExplain = (doc) => {
    const textToSpeak = `${doc.name}. ${doc.descriptionMr}. मिळवण्याचा मार्ग: ${doc.howToGetMr}`;
    speak(textToSpeak);
  };

  const handlePrint = () => {
    window.print();
  };

  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-saffron" />
            <span>Smart Public Document Checklist</span>
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-indic">
            सरकारी योजना कागदपत्रे तपासणी यादी
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            सरकारी योजनेचा अर्ज भरण्यापूर्वी आपल्याकडे कोणती कागदपत्रे उपलब्ध आहेत ते तपासा आणि चिन्हांकित करा.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-xs shadow-sm hover:bg-slate-50 transition print:hidden"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>यादी प्रिंट करा</span>
        </button>
      </div>

      {/* Progress pill */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-sm font-semibold">
        <span>आपण तपासलेली कागदपत्रे:</span>
        <span className="font-bold text-teal-800">
          {checkedCount} / {COMMON_GOVT_DOCS.length} उपलब्ध आहेत
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-4">
        {COMMON_GOVT_DOCS.map((doc) => {
          const isChecked = Boolean(checkedDocs[doc.id]);
          return (
            <div
              key={doc.id}
              className={`p-6 rounded-3xl border transition-all ${
                isChecked
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleCheck(doc.id)}
                    className="mt-1 text-teal-800 hover:scale-110 transition"
                    aria-label="Toggle document checked"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Square className="w-6 h-6 text-slate-400" />
                    )}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-lg font-bold font-indic ${
                          isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'
                        }`}
                      >
                        {doc.name}
                      </h3>
                      {doc.isMandatory && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                          अनिवार्य (Mandatory)
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {doc.descriptionMr}
                    </p>
                    <div className="text-xs text-teal-800 font-medium">
                      📌 <strong>कसे मिळवायचे:</strong> {doc.howToGetMr}
                    </div>
                  </div>
                </div>

                {/* Voice explanation trigger */}
                <button
                  onClick={() => handleVoiceExplain(doc)}
                  className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition shrink-0 flex items-center gap-1.5 print:hidden"
                  title="Listen to document explanation"
                >
                  <Volume2 className="w-4 h-4 text-saffron" />
                  <span className="hidden sm:inline">ऐका</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentChecklistPage;
