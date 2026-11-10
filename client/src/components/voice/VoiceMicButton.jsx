import React from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

const VoiceMicButton = ({
  isRecording = false,
  isLoading = false,
  audioLevel = 0,
  onClick,
  label = 'माईक दाबून बोला',
  subtitle = 'Tap to speak your question',
  size = 'large', // 'large' or 'compact'
}) => {
  if (size === 'compact') {
    return (
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${
          isRecording
            ? 'bg-rose-600 text-white animate-pulse'
            : 'bg-teal-800 hover:bg-teal-700 text-white hover:scale-105'
        }`}
        aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isRecording ? (
          <Square className="w-4 h-4 fill-white" />
        ) : (
          <Mic className="w-4 h-4 text-saffron-300" />
        )}
        <span>{isRecording ? 'थांबवा' : 'बोलून विचारा'}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-6 text-center select-none">
      {/* Outer Glow & Animated Ripple Layers */}
      <div className="relative flex items-center justify-center">
        {isRecording && (
          <>
            <span className="absolute w-44 h-44 rounded-full bg-rose-500/20 animate-ping" />
            <span className="absolute w-36 h-36 rounded-full bg-rose-500/30 animate-pulse" />
          </>
        )}

        {/* Core Main Button */}
        <button
          onClick={onClick}
          disabled={isLoading}
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 ${
            isRecording
              ? 'bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-600 text-white ring-8 ring-rose-200/60 scale-105'
              : isLoading
              ? 'bg-slate-700 text-white cursor-wait'
              : 'bg-gradient-to-tr from-teal-950 via-teal-800 to-saffron text-white ring-8 ring-teal-900/10 hover:ring-saffron/20 hover:scale-105'
          }`}
          aria-label={isRecording ? 'Stop recording' : 'Start speaking'}
        >
          {isLoading ? (
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          ) : isRecording ? (
            <Square className="w-10 h-10 fill-white text-white drop-shadow" />
          ) : (
            <Mic className="w-12 h-12 text-white drop-shadow-md transition-transform group-hover:scale-110" />
          )}

          <span className="text-[11px] font-bold uppercase tracking-wider mt-1 text-white/90">
            {isRecording ? 'थांबवा' : 'बोला'}
          </span>
        </button>
      </div>

      {/* Visualizer during recording */}
      {isRecording && (
        <div className="mt-4">
          <AudioVisualizer level={audioLevel} isRecording={isRecording} />
        </div>
      )}

      {/* Status Captions */}
      <div className="mt-4 space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-indic tracking-tight">
          {isRecording ? 'मी ऐकत आहे... बोला' : label}
        </h3>
        <p className="text-sm font-medium text-slate-500">
          {isRecording ? 'बोलून झाल्यावर पुन्हा टॅप करा' : subtitle}
        </p>
      </div>
    </div>
  );
};

export default VoiceMicButton;
