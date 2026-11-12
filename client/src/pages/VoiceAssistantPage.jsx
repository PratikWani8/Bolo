import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { aiAPI } from '../services/api';
import VoiceMicButton from '../components/voice/VoiceMicButton';
import SpeechPreview from '../components/voice/SpeechPreview';
import VerifiedBadge from '../components/common/VerifiedBadge';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Send,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

const VoiceAssistantPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const autoStart = searchParams.get('autostart') === 'true';

  const { currentLang } = useLanguage();

  const [textInput, setTextInput] = useState('');
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [detectedLang, setDetectedLang] = useState(currentLang);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(0.95);

  const audioPlayerRef = useRef(null);

  // Hook for recording voice
  const {
    isRecording,
    audioBlob,
    audioLevel,
    liveTranscript,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder({
    language: currentLang,
    onTranscriptPreview: (text) => setActiveQuery(text),
  });

  // Hook for browser speech synthesis fallback
  const {
    speak,
    stop: stopTTS,
    isPlaying: isBrowserTTSPlaying,
  } = useSpeechSynthesis({
    language: detectedLang || currentLang,
  });

  // Automatically execute query if passed via URL param
  useEffect(() => {
    if (initialQuery) {
      handleSendText(initialQuery);
    }
  }, [initialQuery]);

  // When recording stops and an audioBlob is ready, send to backend STT + AI pipeline
  useEffect(() => {
    if (audioBlob && !isRecording) {
      handleProcessAudio(audioBlob);
    }
  }, [audioBlob, isRecording]);

  const handleProcessAudio = async (blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'user_voice.webm');
      formData.append('language', currentLang);
      if (liveTranscript) {
        formData.append('transcript', liveTranscript);
      }

      const res = await aiAPI.sendVoice(formData);
      if (res.data?.success) {
        setResponse(res.data);
        setActiveQuery(res.data.transcript || liveTranscript || 'बोललेला आवाज प्रश्न');
        setDetectedLang(res.data.detectedLanguage || currentLang);

        // Auto-play TTS audio
        if (res.data.audioBase64) {
          playBase64Audio(res.data.audioBase64);
        } else if (res.data.text) {
          speak(res.data.text);
        }
      }
    } catch (err) {
      console.warn('Voice processing fallback:', err);
      // Fallback query with transcript
      if (liveTranscript) {
        handleSendText(liveTranscript);
      }
    } finally {
      setLoading(false);
      resetRecording();
    }
  };

  const handleSendText = async (queryText) => {
    const q = queryText || textInput;
    if (!q.trim()) return;

    setLoading(true);
    setActiveQuery(q);
    setTextInput('');
    stopTTS();

    try {
      const res = await aiAPI.sendChat({
        query: q,
        language: currentLang,
      });

      if (res.data?.success) {
        setResponse(res.data);
        setDetectedLang(res.data.detectedLanguage || currentLang);

        // Speak the answer aloud
        speak(res.data.text);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const playBase64Audio = (b64) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(b64);
    audio.playbackRate = audioSpeed;
    audioPlayerRef.current = audio;
    audio.play().catch(() => {
      // If browser autoplay restrictions block, use speech synthesis
      if (response?.text) speak(response.text);
    });
  };

  const handleRepeatSpeech = () => {
    if (response?.audioBase64) {
      playBase64Audio(response.audioBase64);
    } else if (response?.text) {
      speak(response.text);
    }
  };

  const handleStopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    stopTTS();
  };

  const handleToggleMic = () => {
    if (isRecording) {
      stopRecording();
    } else {
      handleStopAudio();
      startRecording();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title & Context Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-saffron" />
          <span>Multilingual Voice AI • Grounded Public Information</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-indic tracking-tight">
          बोलो आवाज सहाय्यक (Voice Help)
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          खालील माईक बटण दाबून बोला किंवा टाईप करा. BOLO अधिकृत शासकीय नियमांनुसार अचूक माहिती देईल.
        </p>
      </div>

      {/* Primary Voice Interaction Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-teal-200 shadow-xl text-center space-y-6">
        {/* Large Central Microphone */}
        <VoiceMicButton
          isRecording={isRecording}
          isLoading={loading}
          audioLevel={audioLevel}
          onClick={handleToggleMic}
          label="बोलण्यासाठी माईकवर स्पर्श करा"
          subtitle="Speak in Marathi, Hindi, English, etc."
        />

        {/* Live speech preview during speech */}
        <SpeechPreview
          transcript={liveTranscript || activeQuery}
          detectedLanguage={detectedLang}
          isRecording={isRecording}
        />

        {/* Text Input Fallback Bar */}
        <div className="max-w-2xl mx-auto pt-4 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="किंवा येथे प्रश्न टाईप करा (उदा. लाडकी बहीण योजना...)"
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 bg-slate-50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !textInput.trim()}
              className="p-3.5 rounded-2xl bg-teal-800 hover:bg-teal-700 disabled:opacity-50 text-white font-bold transition shadow-md"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* AI Grounded Response Display */}
      {response && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header Bar with Verification & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <VerifiedBadge date={response.scheme?.lastVerifiedAt || new Date()} />
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                भाषा: {detectedLang.toUpperCase()}
              </span>
            </div>

            {/* Audio Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRepeatSpeech}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition"
                title="Repeat voice response"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पुन्हा ऐका (Replay)</span>
              </button>

              <button
                onClick={handleStopAudio}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                title="Stop audio playback"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>थांबवा (Stop)</span>
              </button>
            </div>
          </div>

          {/* Spoken AI Explanation Text */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              सत्यापित स्पष्टीकरण (Official Grounded Explanation):
            </div>
            <div className="text-base sm:text-lg text-slate-800 font-indic leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
              {response.text}
            </div>
          </div>

          {/* Scheme Breakdown if available */}
          {response.scheme && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Required Documents */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900 uppercase">
                  <FileCheck className="w-4 h-4 text-teal-700" />
                  <span>आवश्यक कागदपत्रे (Required Documents)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {response.scheme.requiredDocuments?.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>
                        <strong>{doc.name}:</strong> {doc.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Official Portals & Helpline */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-900 uppercase mb-2">
                    <ExternalLink className="w-4 h-4 text-teal-700" />
                    <span>अधिकृत अर्ज लिंक व हेल्पलाईन</span>
                  </div>
                  <div className="text-xs text-slate-600 mb-2">
                    विभाग: {response.scheme.governmentDepartment}
                  </div>
                </div>

                <div className="space-y-2">
                  {response.scheme.officialUrl && (
                    <a
                      href={response.scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      <span>अधिकृत पोर्टलवर अर्ज करा</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {response.scheme.helpline && (
                    <a
                      href={`tel:${response.scheme.helpline.split('/')[0].trim()}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>हेल्पलाईन: {response.scheme.helpline}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sources Citations */}
          {response.sources && response.sources.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                शासकीय संदर्भ व स्त्रोत (Source Provenance):
              </div>
              <div className="flex flex-wrap gap-2">
                {response.sources.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900 text-xs font-medium border border-slate-200 transition"
                  >
                    <span>{s.title}</span>
                    <span className="text-[10px] text-slate-400">({s.department})</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Questions Chips */}
          {response.suggestedFollowUps && response.suggestedFollowUps.length > 0 && (
            <div className="pt-2 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                संबंधित पुढील प्रश्न (Suggested Follow-up Questions):
              </div>
              <div className="flex flex-wrap gap-2">
                {response.suggestedFollowUps.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendText(chip)}
                    className="px-3 py-1.5 rounded-xl bg-saffron/10 hover:bg-saffron text-saffron-800 hover:text-white text-xs font-semibold border border-saffron/20 transition text-left"
                  >
                    👉 {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistantPage;
