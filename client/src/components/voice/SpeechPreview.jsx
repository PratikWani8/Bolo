import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';

const SpeechPreview = ({ transcript, detectedLanguage, isRecording }) => {
  if (!transcript && !isRecording) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 p-4 rounded-2xl bg-white/95 border border-teal-200 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-saffron" />
          <span>{isRecording ? 'आपण बोलत आहात...' : 'विचारलेला प्रश्न'}</span>
        </div>
        {detectedLanguage && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-900 border border-teal-300">
            भाषा: {detectedLanguage.toUpperCase()}
          </span>
        )}
      </div>
      <p className="text-base sm:text-lg font-medium text-slate-800 font-indic leading-relaxed">
        {transcript || 'बोलणे सुरू करा, तुमचा आवाज येथे दिसेल...'}
      </p>
    </div>
  );
};

export default SpeechPreview;
