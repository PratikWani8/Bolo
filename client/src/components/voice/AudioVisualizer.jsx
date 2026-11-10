import React from 'react';

const AudioVisualizer = ({ level = 0, isRecording = false }) => {
  if (!isRecording) return null;

  // Generate 12 responsive waveform bars
  const bars = [15, 30, 60, 90, 45, 75, 100, 80, 50, 70, 40, 20];

  return (
    <div className="flex items-center justify-center gap-1.5 h-12 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg border border-slate-700">
      {bars.map((baseHeight, idx) => {
        // Vary heights based on live audio level
        const scale = Math.max(0.2, (level / 100) * (baseHeight / 100) * 1.8);
        const dynamicHeight = Math.min(36, Math.max(6, 36 * scale));

        return (
          <div
            key={idx}
            className="w-1.5 rounded-full bg-gradient-to-t from-saffron to-amber-300 transition-all duration-75 ease-out"
            style={{
              height: `${dynamicHeight}px`,
              opacity: 0.6 + (level / 100) * 0.4,
            }}
          />
        );
      })}
    </div>
  );
};

export default AudioVisualizer;
